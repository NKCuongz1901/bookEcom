import BookDetail from "@/components/book/bookDetail";
import BookLoading from "@/components/loading/bookLoading";
import { getBookByIdAPI } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookPage = () => {
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { notification } = App.useApp();
    const params = useParams()

    const id = params.id;
    useEffect(() => {
        if (id) {
            const fetchBookById = async () => {
                setLoading(false)
                const res = await getBookByIdAPI(id);
                if (res && res.data) {
                    setCurrentBook(res.data)
                } else {
                    notification.error({
                        message: "Fail get book"
                    })
                }
                setLoading(true);
            }
            fetchBookById();
        }
    }, [id])
    return (
        <>
            {loading ?
                <BookDetail
                    currentBook={currentBook}
                />
                :
                <BookLoading />

            }

        </>

    )

}
export default BookPage;