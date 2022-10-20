import { useRef, useState, useCallback } from "react";
import useBookSearch from "../hooks/useBookSearch";

export default function InfiniteScrollWds() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const { books, hasMore, loading, error } = useBookSearch(query, page);

    const observer = useRef<any>();
    const lastBookRef = useCallback(
        (node: any) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((p) => p + 1);
                }
            });
            if (node) observer.current.observe(node);
            console.log(node);
        },
        [loading, hasMore],
    );

    console.log(books);
    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                }}
            />
            {books.map((book, index) => {
                if (books.length === index + 1) {
                    return (
                        <div ref={lastBookRef} key={book}>
                            {book}
                        </div>
                    );
                }
                return <div key={book}>{book}</div>;
            })}
            <div>{loading && "Loading..."}</div>
            <div>{error && "Error"}</div>
        </div>
    );
}
