import axios from 'services/axios.customize';

export const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "/api/v1/user/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone });
}
export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchUser>>(urlBackend, {
        headers: {
            delay: 1000
        }
    });
}
export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(urlBackend);
}
export const getUserPaginateAPI = (query: string) => {
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
}
export const createUserAPI = (fullName: string, password: string, email: string, phone: string) => {
    const urlBackend = "/api/v1/user";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, password, email, phone });
}
export const createListUserAPI = (data: {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}[]) => {
    const urlBackend = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IImport>>(urlBackend, data)
}
export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackend = "/api/v1/user";
    return axios.put<IBackendRes<IRegister>>(urlBackend, { _id, fullName, phone });
}
export const deleteUserAPI = (_id: string) => {
    const urlBackend = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend);
}
export const getBookPaginateAPI = (query: string) => {
    const urlBackend = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
}
export const getCategoryAPI = () => {
    const urlBackend = "/api/v1/database/category";
    return axios.get<IBackendRes<string[]>>(urlBackend);
}

export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios<IBackendRes<{
        fileUploaded: string
    }>>({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder
        },
    })
}
export const createBookAPI = (mainText: string, author: string, price: number, quantity: number, category: string, thumbnail: string, slider: string[]) => {
    const urlBackend = "/api/v1/book";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { mainText, author, price, quantity, category, thumbnail, slider });
}
export const updateBookAPI = (_id: string, mainText: string, author: string, price: number, quantity: number, category: string, thumbnail: string, slider: string[]) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.put<IBackendRes<IRegister>>(urlBackend, { mainText, author, price, quantity, category, thumbnail, slider });
}
export const deleteBookAPI = (_id: string) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}
export const getBookByIdAPI = (id: string) => {
    const urlBackend = `/api/v1/book/${id}`;
    return axios.get<IBackendRes<IBookTable>>(urlBackend, {
        headers: {
            delay: 1000
        }
    });
}
export const createOrderAPI = (name: string, address: string, phone: string, totalPrice: number, type: string, detail: any) => {
    const urlBackend = "/api/v1/order";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { name, address, phone, totalPrice, type, detail });
}
export const getHistoryOrderAPI = () => {
    const urlBackend = "/api/v1/history";
    return axios.get<IBackendRes<IHistory[]>>(urlBackend);
}
export const changeInfoUserAPI = (fullName: string, phone: string, avatar: string, _id: string) => {
    const urlBackend = "/api/v1/user";
    return axios.put<IBackendRes<IRegister>>(urlBackend, { fullName, phone, avatar, _id })
}
export const changePasswordAPI = (email: string, oldpass: string, newpass: string) => {
    const urlBackend = "/api/v1/user/change-password";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { email, oldpass, newpass });
}
export const getOrderPaginateAPI = (query: string) => {
    const urlBackend = `/api/v1/order?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
}