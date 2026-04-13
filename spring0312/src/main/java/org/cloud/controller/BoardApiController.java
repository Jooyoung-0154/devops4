package org.cloud.controller;
	
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.cloud.dto.BoardDto;
import org.cloud.dto.Criteria;
import org.cloud.dto.PageResponse;
import org.cloud.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

	@CrossOrigin(origins = "http://localhost:5173")
	@RestController
	@RequestMapping("/api/board")
	public class BoardApiController {

		@Autowired
		private BoardService boardService;
		
		@GetMapping("/list")
		public Map<String, Object> openBoardList(Criteria cri) throws Exception {
			if (cri.getPageNum() <= 0) {
				cri.setPageNum(1);
			}
			if (cri.getAmount() <= 0) {
				cri.setAmount(10);
			}
			
			List<BoardDto> list = boardService.selectBoardListPaging(cri);
			int total = boardService.selectBoardTotalCount();
			
			Map<String, Object> response = new HashMap<>();
	        response.put("list", list);
	        response.put("pageMaker", new PageResponse(cri, total));
			
	        return response;
		}	
		
		
		@PostMapping("/insert")
		public String insertBoard(@ModelAttribute BoardDto board, MultipartHttpServletRequest multipartHttpServletRequest) throws Exception {
			boardService.insertBoard(board, multipartHttpServletRequest);
			return "success";
		}
		
		@GetMapping("/detail/{num}")
		public BoardDto openBoardDetail(@PathVariable("num") int boardId) throws Exception {
			return boardService.selectDetail(boardId);
		}
		
		@PostMapping("/update")
		public String updateBoard(@ModelAttribute BoardDto board, MultipartHttpServletRequest request) throws Exception {
			boardService.updateBoard(board, request);
			return "success";
		}
		
		@PostMapping("/delete/{num}")
		public String deleteBoard(@PathVariable("num") int boardId) throws Exception {
			boardService.deleteBoard(boardId);
			return "success";
		}
		
		@PostMapping("/deleteFile/{num}")
		@ResponseBody
		public String deleteFile(@PathVariable("num") int fileIdx) throws Exception {
			try {
				boardService.deleteFile(fileIdx);
				return "success";
			} catch (Exception e) {
				// TODO: handle exception
				return "fail";
			}
		}
	}