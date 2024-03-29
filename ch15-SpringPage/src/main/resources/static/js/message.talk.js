$(function(){
	let message_socket;	//웹소켓 식별자
	
	/*---------------------
		채팅 회원 저장
	-----------------------*/
	let member_list = [];	//채팅 회원을 저장하는 배열
	//채팅방 멤버를 저장하는 배열
	//채팅방 또는 채팅 페이지를 인식해서 채팅방 멤버를 초기 세팅함
	if($('#talkWrite').length>0){//채팅방 생성 페이지  
					//ajax는 태그 인식하면 배열로 받아들이기 때문에 length가 0보다 크다는 것은 데이터 존재한다는 의미
		member_list = [$('#user').attr('data-id')];
	}else if($('#talkDetail').length>0){//채팅 페이지
		//웹소켓 연결 후 코드 입력 해야함
		
	}
		
	
	
	/*---------------------
		웹소켓 연결
	-----------------------*/
	
	
	
	
	/*---------------------
		채팅방 생성하기
	-----------------------*/
	//회원 정보 검색
	$('#member_search').keyup(function(){
		if($('#member_search').val().trim()==''){
			$('#search_area').empty();
			return;
		}
		//서버와 통신
		$.ajax({
			url:'memberSearchAjax',
			type:'post',
			data:{id:$('#member_search').val()},
			dataType:'json',
			success:function(param){
				if(param.result == 'logout'){
					$('#member_search').attr('disabled',true);
					$('#member_search').val('로그인해야 회원 검색이 가능합니다.');
				}else if(param.result == 'success'){
					$('#search_area').empty();
					$(param.member).each(function(index,item){
						//채팅방 개설자의 아이디와 동일한 아이디 체크
						if(!member_list.includes(item.id)){
							//채팅방 개설자의 아이디와 다른 아이디만 표시
							let output = '';
							output += '<li data-num="'+item.mem_num+'">';
							output += item.id;
							output += '</li>';
							$('#search_area').append(output);
						}
					});
				}else{
					alert('회원 검색 오류 발생');
				}
			},
			error:function(){
				alert('네트워크 오류 발생');
			}
		});
	});
	
	//검색된 회원 선택하기
	$(document).on('click','#search_area li',function(){
		let id = $(this).text();//선택한 아이디
		let mem_num = $(this).attr('data-num');//선택한 회원번호
		member_list.push(id);
		//선택한 id를 화면에 표시
		let choice_id = '<span class="member-span" data-id="'+id+'">';
		choice_id += '<input type="hidden" name="members" value="'+mem_num+'">';
		choice_id += id + '<sup>&times;</sup></span>';
		
		$('#talk_member').append(choice_id);
		$('#member_search').val('');
		$('#search_area').empty();//ul태그 초기화
		
		if($('#name_checked').is(':checked')){//채팅방 이름 자동 설정
			makeRoom_name();
		}
	});
	
	//채팅방 이름 생성 방식 정하기(자동/수동)
	$('#name_checked').click(function(){
		if($('#name_checked').is(':checked')){//채팅방 이름 자동 생성(체크됨)
			$('#basic_name').attr('type','hidden');
			if(member_list.length>1){
				makeRoom_name();
			}
		}else{//채팅방 이름 수동 생성
			$('#basic_name').attr('type','text');
			$('#name_span').text('');//채팅방 이름 표시 텍스트 초기화
		}
	});
	
	//채팅방 이름 생성
	function makeRoom_name(){
		let name = '';
		$.each(member_list,function(index,item){
			if(index>0) name += ',';
			name += item;
			
		});
		if(name.length>55){
			name = name.substring(0,55) + '...';
		}
		$('#basic_name').val(name);
		$('#name_span').text(name);
	}
	
	/*---------------------
		채팅하기
	-----------------------*/
});









































