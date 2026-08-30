import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="size-full col-flex-center justify-center">
            <h3 className="text-3xl text-center">Not Found 😢</h3>
            <div className="text-2xl text-center mb-5">Try checking your url again</div>
            <Link to="/" className="text-2xl underline text-blue-600">Take me home!</Link>
        </div>
    );
}

export default NotFound