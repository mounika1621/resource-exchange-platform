package com.resourceexchange.service;

import com.resourceexchange.dto.*;
import com.resourceexchange.entity.*;
import com.resourceexchange.exception.ApiException;
import com.resourceexchange.repository.ExchangeRequestRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RequestService {

    private final ExchangeRequestRepository repo;
    private final ResourceService resources;
    private final CurrentUserService current;

    public RequestService(
            ExchangeRequestRepository repo,
            ResourceService resources,
            CurrentUserService current
    ) {
        this.repo = repo;
        this.resources = resources;
        this.current = current;
    }

    @Transactional
    public RequestResponse create(Long resourceId) {

        User u = current.get();

        Resource r = resources.get(resourceId);

        if (r.getOwner().getUserId().equals(u.getUserId())) {
            throw new ApiException(
                    "You cannot request your own resource",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (!r.isAvailability()) {
            throw new ApiException(
                    "Resource is not available",
                    HttpStatus.BAD_REQUEST
            );
        }

        ExchangeRequest x = new ExchangeRequest();

        x.setRequester(u);
        x.setResource(r);

        return RequestResponse.from(repo.save(x));
    }

    @Transactional(readOnly = true)
    public List<RequestResponse> mine() {

        return repo
                .findByRequesterUserIdOrderByRequestDateDesc(
                        current.get().getUserId()
                )
                .stream()
                .map(RequestResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RequestResponse> ownerRequests() {

        return repo
                .findByResourceOwnerUserIdOrderByRequestDateDesc(
                        current.get().getUserId()
                )
                .stream()
                .map(RequestResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RequestResponse> all() {

        return repo
                .findAllByOrderByRequestDateDesc()
                .stream()
                .map(RequestResponse::from)
                .toList();
    }

    @Transactional
    public RequestResponse status(Long id, RequestStatus status) {

        ExchangeRequest x = repo.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                "Request not found",
                                HttpStatus.NOT_FOUND
                        )
                );

        User u = current.get();

        boolean admin = u.getRole() == Role.ADMIN;

        boolean owner =
                x.getResource()
                        .getOwner()
                        .getUserId()
                        .equals(u.getUserId());

        boolean requester =
                x.getRequester()
                        .getUserId()
                        .equals(u.getUserId());

        if (status == RequestStatus.CANCELLED) {

            if (!requester || x.getStatus() != RequestStatus.PENDING) {
                throw new ApiException(
                        "Only the requester can cancel a pending request",
                        HttpStatus.FORBIDDEN
                );
            }

        } else if (
                status == RequestStatus.ACCEPTED ||
                status == RequestStatus.REJECTED
        ) {

            if (!owner && !admin) {
                throw new ApiException(
                        "Only the resource owner or admin can approve/reject",
                        HttpStatus.FORBIDDEN
                );
            }

            if (x.getStatus() != RequestStatus.PENDING) {
                throw new ApiException(
                        "Only pending requests can be reviewed",
                        HttpStatus.BAD_REQUEST
                );
            }

            if (status == RequestStatus.ACCEPTED) {
                x.getResource().setAvailability(false);
            }

        } else if (status == RequestStatus.COMPLETED) {

            if (!owner && !admin) {
                throw new ApiException(
                        "Only owner or admin can complete",
                        HttpStatus.FORBIDDEN
                );
            }

        } else {

            throw new ApiException(
                    "Unsupported status change",
                    HttpStatus.BAD_REQUEST
            );
        }

        x.setStatus(status);

        return RequestResponse.from(repo.save(x));
    }
}