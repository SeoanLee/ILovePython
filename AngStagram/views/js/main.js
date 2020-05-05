
//script를 위에 선언할경우 내용을 이 안에 넣어서 사용
//문서가 준비될때까지 기다렸다가 실행해라
//window.addEventListener('DOMContentLoaded', function(){ });

//const heart = document.querySelector('.heart_btn');
const header = document.querySelector('#header');
const sidebox = document.querySelector('.side_box');
const veriableWidth = document.querySelectorAll('.contents_box .contents'); // 모바일에서 좌우값 설정
const delegation = document.querySelector('.contents_box');


// //이름이 없는 함수 : Anonymous function 
// heart.addEventListener('click', function(){
// //하트눌렀을때 색깔 바꾸기
//     console.log('hit');
//     //heart.classList.add('on')
//     heart.classList.toggle('on');
// });


function delegationFunc(e){
    //click event는 event객체(e)를 받을수있음
    let elem = e.target; //이벤트 객체의 target속성으로 접근
    console.log(elem);

    //잘못 클릭한경우 조건처리
    while(!elem.getAttribute('data-name')){
        //getAttribute : 속성을 얻는다..!
        elem = elem.parentNode; //element의 parentNode를 넣고 찾게함

        if(elem.nodeName === "BODY"){
        //만약 parentNode를 타고 올라가면서 data-name을 찾다가 BODY라는 속성을 만나면,
        //element를 빈값으로 끝내고, 이 함수를 끝내라
            elem = null;
            return; //이 함수 자체를 끝내버리는 역할
        }
    }

    if(elem.matches('[data-name="heartbeat"]')){
        //클릭한 element의 data name이 heartbeat를 가지고 있다면

        console.log('하트');
        let pk = elem.getAttribute('name');

        //jquery로 ajax해보기
        $.ajax({
            type:'GET', //일반적으로 post를 많이 사용
            //url을 서버로 보낼때 경로 같이 보냄 : GET, 경로생략 : POST
            url:'data/like.json', // 이 주소랑 통신할거임!
            data:{pk}, //{pk} = PrimaryKey
            dataType:'json', //내가 보낸것이 어떤 형태로 들어올건지
            success:function(response){
            //통신이 완료가 되었을때, response객체를 받아옴
            //response객체는 통신이 성공한 data

                //사용자에따라 계속 바뀌기때문에 pk로 변수처리함
                //let likeCount = document.querySelector('#like-count-' + pk);
                let likeCount = document.querySelector('#like-count-37');
                likeCount.innerHTML = '좋아요' + response.like_count + '개';

                //console.log(response.nickname);

            }, error:function(request, status, error){
                alert('에러발생!');
                //window.location.replace('/accounts/login');
            }
        })

    } else if(elem.matches('[data-name="bookmark"]')){
        console.log('북마크')

        let pk = elem.getAttribute('name');
        $.ajax({
            type:'GET',
            url:'data/bookmark.json',
            data:{pk},
            dataType:'json',
            success:function(response){
                let bookmarkCount = document.querySelector('#bookmark-count-' + pk);
                bookmarkCount.innerHTML = '북마크' + response.bookmark_count + '개';
            
            }, error:function(request, status, error){
                alert('에러발생!');
            }
        });
  
    } else if(elem.matches('[data-name="share"]')){
        console.log('공유')

    } else if(elem.matches('[data-name="more"]')){
        console.log('더보기')
   
    } else if(elem.matches('[data-name="comment"]')){
        
        let content = document.querySelector('#add-comment-post-37 > input[type=text]').value;
        //add-comment-post-37 안에있는 input의 type을 체크해서 text인 친구의 value(=input안에 들어가는 글자들) 가지고오기
        console.log(content);

        // 댓글수 제한
        if(content.length > 140){
            alert('댓글은 최대 140자 입력 가능합니다. 현재 글자수 : ' + content.length);
            return;
        }

        $.ajax({
            type:'GET',
            url:'./comment.html', //comment는 dom을 하나씩 뿌려주기때문에 dataType을 html로
            data:{
                'pk':37,
                'content':content
                },
            dataType:'html',
            success:function(data){
                document.querySelector('#comment-list-ajax-post-37').insertAdjacentHTML('afterbegin', data);

                //** insertAdjacentHTML() 메서드
                //element.insertAdjacentHTML('position', text);
                //HTML, XML같은 특정 텍스트 파싱, 특정 위치에 DOM tredd안에 원하는 node들을 추가
                //이미 사용중인 element는 다시 파싱하지않음 (innerHTML과는 다르며, 작업이 빠름)

                //position은 아래 있는 단어만 사용 가능
                //beforebegin : element 앞에
                //afterbegin : element 안에 가장 첫번째 child
                //boforeend : element 안에 가장 마지막 child
                //afterend : element 뒤에
            }, error:function(request, status, error){
                alert('댓글 에러발생!');
            }
        });

    } else if(elem.matches('[data-name="comment_delete"]')){

        $.ajax({
            type:'GET',
            url:'data/delete.json',
            data:{
                'pk':37,
            },
            dataType:'json',
            success:function(response){
                if(response.status){
                    let comt = document.querySelector('.comment-detail');
                    comt.remove();
                }
            }, error:function(request, status, error){
                alert('댓글 에러발생!');
            }
        });

        
    } else if(elem.matches('[data-name="follow"]')){
    
        $.ajax({
            type:'GET',
            url:'data/follow.json',
            data:{
                'pk':37
            },
            dataType:'json',
            success:function(response){
                if(response.status){
                    //response에 status가 있으면
                    document.querySelector('input.follow').value = "팔로잉";
                    //follow클래스가 붙어있는 input 찾아서 value를 팔로잉으로
                } else {
                    document.querySelector('input.follow').value = "팔로워";
                }
            }, error:function(request, status, error){
                 alert('에러발생!');
            }
        });

    }
    //클릭하는 대상에게 전부 on 붙여주기
    elem.classList.toggle('on');
}


function resizeFunc(){
    if(pageYOffset >= 10){
    //스크롤시 sidebox 위치 설정하기
    //화면의 절반을 계산하고 조금씩 밀어보기
    console.log(window.innerWidth * 0.5);

    let calcWidth = (window.innerWidth * 0.5) + 167;

    sidebox.style.left = calcWidth + 'px';

    }

    //css에서 반응형 사용할때 썻던 미디어쿼리 같은 기능
    if(matchMedia('screen and (max-width : 800px)').matches){
        //모든 contents에 같은 효과를 줘야하기때문에 반복문사용
        for(let i = 0; i < veriableWidth.length; i++){
            //유사배열
            veriableWidth[i].style.width = window.innerWidth -20 + 'px';
        }

    } else {
        for(let i = 0; i < veriableWidth.length; i++){
            if(window.innerWidth > 600){
            veriableWidth[i].removeAttribute('style');
            }
        }  
    }
}


function scrollFunc(){
//스크롤 했을때 header 따라오게하기

    let scrollHeigth = pageYOffset + window.innerHeight;
    //스크롤 세로값 찾기위한 내장함수, scrollHeigth 스크롤 할때부터 값 측정
    //화면의값은 innerHeight를 이용해서 보고있는 창의 Y값 계산

    let documentHeight = document.body.scrollHeight;
    //전체 document의 높이값, documentHeight 위에서부터 밑에까지 전부 재줌

    console.log('scrollHeigth : ' + scrollHeigth);
    console.log('documentHeight : ' + documentHeight);
    

    //스크롤시 sidebar 설정
    if(pageYOffset >= 10){
        header.classList.add('on');

        //나중에 다른 html을 만들때 에러가 발생할수있으므로 조건처리
        if(sidebox){
            sidebox.classList.add('on');
        }

        resizeFunc();

    } else {
        header.classList.remove('on');

        if(sidebox){
            sidebox.classList.remove('on');
            //left값을 없애는것보다 style속성을 없애는게 좀더 편함
            sidebox.removeAttribute('style');
        }
    }

    
    //무한스크롤
    if(scrollHeigth >= documentHeight){
        //페이지 넘버링
        let page = document.querySelector('#page').value;

        //넘버링 만들기 (무한스크롤 제어)
        //ajax 통신할때마다 value를 1씩 증가시키기
        document.querySelector('#page').value = parseInt(page) + 1;
        //parseInt는 계산을 해주는 함수

        if(page > 5){
            return;
        }

        callMorePostAjax(page);   
    }
}

function callMorePostAjax(page){

    if(page > 5){
        return;
    }

    $.ajax({
        type:'GET',
        url:'./post.html',
        data:{
            'page':page
        },
        dataType:'html',
        success:addMorePostAjax,
        error:function(request, status, error){
            alert('에러발생!');
        }  
    })   
}

function addMorePostAjax(data){

    delegation.insertAdjacentHTML('beforeend', data);

}

//새로고침이 이루어질때마다 스크롤 제일 위로 올라가게함
setTimeout(function(){
    scrollTo(0,0) //스크롤 위치
},100); //0.01초


//ajax (Asynchronous JavaScript And XML) 비동기통신
//서버와 연결이 되어있어야함. 부분만, 그때그때 수행


//window객체에 각각 이벤트 주기
//함수를 하나 만들어서 호출하는방식으로 해보기
if(delegation){
    delegation.addEventListener('click', delegationFunc);
}
window.addEventListener('scroll', scrollFunc);
window.addEventListener('resize', resizeFunc);
