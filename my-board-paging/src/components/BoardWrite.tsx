import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./BoardWrite.css";

const BoardWrite: React.FC = () => {
  const navigate = useNavigate();

  const [board, setBoard] = useState({
    title: "",
    contents: "",
    creatorId: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBoard({ ...board, [name]: value });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!board.title || !board.contents) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", board.title);
    formData.append("contents", board.contents);
    formData.append("creatorId", board.creatorId);

    if (file) {
      formData.append("file", file);
    }

    try {
      await api.post("/insert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("글이 성공적으로 등록되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("등록 에러", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="write-page">
      <div className="write-card">
        <h2 className="write-title">새 게시글 작성</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>작성자</label>
            <input
              className="write-input"
              name="creatorId"
              value={board.creatorId}
              onChange={handleChange}
              placeholder="작성자 ID를 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>제목</label>
            <input
              className="write-input"
              name="title"
              value={board.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>내용</label>
            <textarea
              className="write-textarea"
              name="contents"
              value={board.contents}
              onChange={handleChange}
              placeholder="내용을 작성하세요"
            />
          </div>

          <div className="form-group">
            <label>첨부 파일</label>
            <input
              type="file"
              className="write-input"
              onChange={handleFileChange}
            />
          </div>

          <div className="write-button-group">
            <button type="submit" className="btn-submit">
              등록하기
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/")}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardWrite;
