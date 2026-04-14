import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
import type { Board, PageResponse } from "../types/Board";
import "./BoardList.css";

const BoardList: React.FC = () => {
  const [list, setList] = useState<Board[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResponse | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const fetchBoards = (page: number) => {
    api
      .get<{ list: Board[]; pageMaker: PageResponse }>(
        `/list?pageNum=${page}&amount=10`,
      )
      .then((res) => {
        setList(res.data.list);
        setPageInfo(res.data.pageMaker);
      })
      .catch(console.error);
  };
  useEffect(() => {
    fetchBoards(currentPage);
  }, [currentPage]);

  const renderPageNumbers = () => {
    const pages = [];
    if (pageInfo) {
      for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
        pages.push(
          <button
            key={i}
            className={`page-btn ${currentPage === i ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>,
        );
      }
    }
    return pages;
  };

  return (
    <div className="list-container">
      <h2 className="list-title">게시글 목록</h2>
      <table className="board-table">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>번호</th>
            <th style={{ width: "70%" }}>제목</th>
            <th style={{ width: "20%" }}>조회수</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((board) => (
              <tr key={board.boardId}>
                <td>{board.boardId}</td>
                <td style={{ textAlign: "left" }}>
                  <Link className="title-link" to={`/board/${board.boardId}`}>
                    {board.title}
                  </Link>
                </td>
                <td>{board.hitCnt}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>게시글이 존재하지 않습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {pageInfo?.prev && (
          <button onClick={() => setCurrentPage(pageInfo.startPage - 1)}>
            이전
          </button>
        )}

        {renderPageNumbers()}

        {pageInfo?.next && (
          <button onClick={() => setCurrentPage(pageInfo.endPage + 1)}>
            다음
          </button>
        )}
      </div>
      <div className="btn-area">
        <Link to={"/write"}>
          <button className="btn-write">글쓰기</button>
        </Link>
      </div>
    </div>
  );
};

export default BoardList;
