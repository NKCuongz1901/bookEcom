import BookDetail from "@/components/book/bookDetail";
import { useParams } from "react-router-dom";

const BookPage = () => {
    const params = useParams()
    console.log("Check params: ", params.id);
    return (
        <BookDetail />
    )

}
export default BookPage;