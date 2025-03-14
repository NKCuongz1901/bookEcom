export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[]
    }
    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }
    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }
    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }
    interface IFetchUser {
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            page: number,
            total: number,
        }
        result: T[]
    }
    interface IUserTable {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }
    interface IImport {
        countSuccess: number;
        countError: number;
        detail: any;
    }
    interface IBookTable {
        _id: string;
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        price: number;
        sold: number;
        quantity: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }
    interface ICart {
        _id: string;
        quantity: number;
        detail: IBookTable;
    }
    interface IHistory {
        _id: string;
        name: string;
        type: string;
        email: string;
        phone: string;
        userId: string;
        detail: {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
        totalPrice: number;
        createAt: Date;
        updateAt: Date;
    }
    interface IOrderTable {
        _id: string;
        name: string;
        address: string;
        totalPrice: number;
        createdAt: Date;
    }

}
