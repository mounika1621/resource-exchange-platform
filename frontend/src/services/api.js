const BASE = 'https://resource-exchange-platform.onrender.com/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('rep_token');
  const headers = {'Content-Type':'application/json', ...(options.headers || {})};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {...options, headers});
  if (res.status === 204) return null;
  const data = await res.json().catch(()=>({message:'Unexpected server response'}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
export const api = {
  register: (body)=>request('/auth/register',{method:'POST',body:JSON.stringify(body)}),
  login: (body)=>request('/auth/login',{method:'POST',body:JSON.stringify(body)}),
  me: ()=>request('/users/me'),
  updateProfile: (body)=>request('/users/me',{method:'PUT',body:JSON.stringify(body)}),
  resources: (q='',category='')=>request(`/resources?${new URLSearchParams({q,category})}`),
  mineResources: ()=>request('/resources/mine'),
  resource: (id)=>request(`/resources/${id}`),
  createResource: (body)=>request('/resources',{method:'POST',body:JSON.stringify(body)}),
  updateResource: (id,body)=>request(`/resources/${id}`,{method:'PUT',body:JSON.stringify(body)}),
  deleteResource: (id)=>request(`/resources/${id}`,{method:'DELETE'}),
  availability: (id,available)=>request(`/resources/${id}/availability?available=${available}`,{method:'PUT'}),
  createRequest: (resourceId)=>request(`/requests/${resourceId}`,{method:'POST'}),
  myRequests: ()=>request('/requests/mine'),
  ownerRequests: ()=>request('/requests/owner'),
  updateRequestStatus: (id,status)=>request(`/requests/${id}/status`,{method:'PUT',body:JSON.stringify({status})}),
  adminUsers: ()=>request('/admin/users'),
  adminToggleUser: (id,value)=>request(`/admin/users/${id}/enabled?value=${value}`,{method:'PUT'}),
  adminRequests: ()=>request('/admin/requests'),
  adminResourcesDelete: (id)=>request(`/admin/resources/${id}`,{method:'DELETE'}),
  adminRequestStatus: (id,status)=>request(`/admin/requests/${id}/status`,{method:'PUT',body:JSON.stringify({status})}),
  smartMatch: (requirement) =>
  request(
    `/match?${new URLSearchParams({
      requirement
    })}`
  )
};
