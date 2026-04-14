export interface Board {
  boardId: number;
  title: string;
  contents: string;
  creatorId: string;
  hitCnt: number;
  createdDatetime: string;
  storedFilePath?: string;
  fileList?: {
    fileIdx: number;
    boardId: number;
    originalFileName: string;
    storedFilePath: string;
    fileSize: number;
    creatorId: string;
  }[];
}
}
export interface FileDto {
  fileIdx: number;
  boardId: number;
  originalFileName: string;
  storedFilePath: string;
  fileSize: number;
  creatorId: string;
}
export interface PageResponse {
  startPage: number;
  endPage: number;
  total: number;
  prev: boolean;
  next: boolean;
  cri: Criteria;
}
export interface Criteria {
  pageNum: number;
  amount: number;
}
