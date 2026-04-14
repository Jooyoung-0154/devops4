import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import type { Board } from "../types/Board";
import "./BoardDetail.css";

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [file, setFile] = useState<File | null>(null); // 수정 시 새로 첨부할 파일

  useEffect(() => {
    api
      .get<Board>(`/detail/${id}`)
      .then((res) => setBoard(res.data))
      .catch(console.error);
  }, [id]);

  const handleUpdate = async () => {
    if (!board) return;

    const formData = new FormData();
    formData.append("boardId", String(id)); // 수정 시 PK는 필수
    formData.append("title", board.title);
    formData.append("contents", board.contents);
    formData.append("creatorId", board.creatorId || "");

    if (file) {
      formData.append("file", file); // 새 파일이 있다면 첨부
    }

    try {
      await api.post("/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("수정 완료");
      navigate("/");
    } catch (error) {
      console.error("수정 에러", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await api.post(`/delete/${id}`);
      alert("삭제 완료");
      navigate("/");
    } catch (error) {
      console.error("삭제 에러", error);
    }
  };

  if (!board) return <div className="detail-page">Loading...</div>;

  return (
    <div className="detail-page">
      <div className="detail-card">
        <h2 className="detail-title">게시글 상세 및 수정</h2>

        <div className="form-group">
          <label>작성자</label>
          <input
            className="input-field"
            value={board.creatorId || ""}
            onChange={(e) => setBoard({ ...board, creatorId: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>제목</label>
          <input
            className="input-field"
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <textarea
            className="textarea-field"
            value={board.contents}
            onChange={(e) => setBoard({ ...board, contents: e.target.value })}
          />
        </div>
        {board.fileList && board.fileList.length > 0 && (
  <div className="form-group">
    <label>등록된 사진</label>
    <div className="image-preview">
      <img 
        src={`http://54.116.38.189:8080/api/board/file/${board.fileList[0].storedFilePath.split('/').pop()}`}
        alt="게시글 이미지" 
        style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
      />
    </div>
  </div>
)}
        <div className="form-group">
          <label>새 파일 첨부 (수정 시)</label>
          <input
            type="file"
            className="input-field"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
        </div>

        <div className="button-group">
          <button className="btn btn-list" onClick={() => navigate("/")}>
            목록으로
          </button>
          <button className="btn btn-update" onClick={handleUpdate}>
            수정 저장
          </button>
          <button className="btn btn-delete" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
