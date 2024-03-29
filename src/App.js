import { async, getDefaultAppConfig } from '@firebase/util';
import { signInWithPopup } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import {useEffect, useState} from 'react';
import './App.css';
import { auth, db, provider } from './firebase';
import './App.css';
import { labNames, userNames, inmenLabNames, inmenNames, capacity } from './data';
import sha512 from 'js-sha512';



function App() {


const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));
const [uid, setUid] = useState(localStorage.getItem('uid'));
const [signUpList, setSignUpList] = useState([]);

// let labNames = ['松本', '冨重', '三ツ石', '滝沢', '浅井', '大井', '青木', '長尾', '北川', '久保', '渡邊', '溶媒要素技術部(旧猪俣研)', '中山', '珠玖', '服部', '魚住', '梅津', '吉岡', '壹岐', '福島', '芥川', '中川', '陣内', '加藤', '西原', '笠井', '本間', '村松', '西堀', '殷', '蟹江', '(旧)超臨界ナノ工学分野'];
// let labNames = labNames;

const [othersFirstChoices, setOthersFirstChoices] = useState([]);
const [othersSecondChoices, setOthersSecondChoices] = useState([]);
const [othersThirdChoices, setOthersThirdChoices] = useState([]);

const [chosenLab, setChosenLab] = useState([null, null, null]);
const [userCount, setUserCount] = useState();

// var div = document.createElement('div');
// div.innerHTML = `\
// <script type="text/javascript">rakuten_design="slide";rakuten_affiliateId="25daf234.f17a6e59.25daf235.c941a3ad";rakuten_items="ctsmatch";rakuten_genreId="0";rakuten_size="468x160";rakuten_target="_blank";rakuten_theme="gray";rakuten_border="off";rakuten_auto_mode="on";rakuten_genre_title="off";rakuten_recommend="on";rakuten_ts="1677397537639";</script>
// <script type="text/javascript" src="https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js"></script>
// <a href='https://hb.afl.rakuten.co.jp/hsc/25dae539.5fc082df.25dae53a.0f1e33ff/?link_type=pict&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJwaWN0IiwiY29sIjoxLCJjYXQiOiI0NCIsImJhbiI6IjQ2MDEzNSIsImFtcCI6ZmFsc2V9' target="_blank" rel="nofollow sponsored noopener" style={{'word-wrap':'break-word'}}>\
// <img src="https://hbb.afl.rakuten.co.jp/hsb/25dae539.5fc082df.25dae53a.0f1e33ff/?me_id=1&me_adv_id=460135&t=pict" border="0" style={{'margin':'2px'}} alt="" title=""></img></a>\
// `
// div.innerText = 'hi'
// var center = document.getElementsByTagName('center')
// console.log(center[3])
// document.body.appendChild(div)
// console.log(center[3])

// var center = document.createElement('center')
// center.innerHTML = `
// <a href='https://hb.afl.rakuten.co.jp/hsc/25dae539.5fc082df.25dae53a.0f1e33ff/?link_type=pict&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJwaWN0IiwiY29sIjoxLCJjYXQiOiI0NCIsImJhbiI6IjQ2MDEzNSIsImFtcCI6ZmFsc2V9' target="_blank" rel="nofollow sponsored noopener" style={{'word-wrap':'break-word'}}>\
// <img src="https://hbb.afl.rakuten.co.jp/hsb/25dae539.5fc082df.25dae53a.0f1e33ff/?me_id=1&me_adv_id=460135&t=pict" border="0" style={{'margin':'2px'}} alt="" title=""></img></a>\
// `
// document.body.appendChild(center);
// }

useEffect(() => {
  
  if (isAuth) {
    // var center = document.getElementById('advertisement')
    // console.log(center)
    // var script1 = document.createElement('script');
    // var script2 = document.createElement('script');
    // script1.setAttribute('type', 'text/javascript');
    // script2.setAttribute('type', 'text/javascript');
    // script1.innerText = 'rakuten_design="slide";rakuten_affiliateId="25daf234.f17a6e59.25daf235.c941a3ad";rakuten_items="ctsmatch";rakuten_genreId="0";rakuten_size="468x160";rakuten_target="_blank";rakuten_theme="gray";rakuten_border="off";rakuten_auto_mode="on";rakuten_genre_title="off";rakuten_recommend="on";rakuten_ts="1677397537639";'
    // script2.src ='https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js';
    // center.appendChild(script1);
    // center.appendChild(script2);
    // wait()

    // var div = document.createElement('div');
    // div.innerHTML = `\
    // <p style="font-size:14px;margin-bottom:0px;opacity:0.4;">© All rights reserved</p>
    // <a href="http://tohokuuniv.wp.xdomain.jp/home/" target="_blank" style="font-size:14px;margin-top:0px;opacity:0.4;text-decoration:none;display: block;">Presented by <p style="font-size:12px;display:inline;">東北大家庭教師emパワー</p></a>
    // <br>
    // `
    // var footer = document.getElementsByTagName('footer')
    // footer[0].appendChild(div)


  }
  // var center = document.getElementById('advertisement')
  //   console.log(center)

// async function wait() {
//   await delay(5)
// }

//     function delay(n){
//       return new Promise(function(resolve){
//           setTimeout(resolve,n*1000);
//       });
  // }
  
    
  // getMyChoices(); 
  // getOthersChoices();
  const unsubscribe = onSnapshot(collection(db, 'choices2'), (snapshot) => {
    getCurrentChoices();
    // getOthersChoices();
    // getCount();
  });
}, []);

// const getCount = async() => {
//   const data = await getDocs(collection(db, 'choices'));
//   setUserCount(data.docs.length);
// };

// const getMyChoices = async() => {
//   const docRef = doc(db, "choices", localStorage.getItem('email'));
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     setChosenLab(docSnap.data().choices);
//   }
// }

const getCurrentChoices = async() => {
  const data = await getDocs(collection(db, 'choices2'));
  setUserCount(data.docs.length);
 
  setOthersFirstChoices([]);
  setOthersSecondChoices([]);
  setOthersThirdChoices([]);
  setSignUpList([]);

  data.docs.map(async (doc) => {
    await setSignUpList((prevState) => ([...prevState, doc.id]));
    if (doc.id != sha512(localStorage.getItem('uid'))) { 
      setOthersFirstChoices((prevState) => ([...prevState, doc.data().choices[0]]))
      setOthersSecondChoices((prevState) => ([...prevState, doc.data().choices[1]]))
      setOthersThirdChoices((prevState) => ([...prevState, doc.data().choices[2]]))
    } else {
      setChosenLab(doc.data().choices);
    }
  })
};

const choseLab = (priority, labIndex) => {

  const chosenLabList = [...chosenLab]

  
  chosenLab.map((aChosenLab, priorityIndex) => {
    if (priorityIndex === priority) {
      if (chosenLabList[priorityIndex] == labIndex) {
        chosenLabList[priorityIndex] = null;
      } else {
        chosenLabList[priorityIndex] = labIndex;
      }
    } else if (priorityIndex === chosenLab.indexOf(labIndex))  {
      chosenLabList[priorityIndex] = null
    } else {
      chosenLabList[priorityIndex] = aChosenLab
    }
  }
)
  
  setChosenLab(chosenLabList)
  setDb(chosenLabList);
  
}



const setDb = async (chosenLabList) => {
  await setDoc(doc(db, 'choices2', sha512(localStorage.getItem('uid'))), {
    choices: chosenLabList
    // author: auth.currentUser.displayName,
    // id: auth.currentUser.uid
  })
}

const login = () => {
  // ログイン処理
  signInWithPopup(auth, provider).then(async (result) => {
    
    if (!(userNames.includes(result.user.displayName))) {
      alert('化バイのメンバーであることが確認できません.\n2020年度学部3年生(化学・バイオ工学科)クラスルームのメンバー(3月4日時点)のみがログインできます');
      return;
    } 

    setIsAuth(true);
    localStorage.setItem('isAuth', true);
    localStorage.setItem('email', result.user.email);
    localStorage.setItem('uid', result.user.uid);
    localStorage.setItem('displayName', result.user.displayName);

    await getCurrentChoices();
    if (!(signUpList.includes(sha512(result.user.uid)))) {
      setDb([null, null, null])
    }
    // console.log('-----');
    // console.log(signUpList);
    // console.log('-----');
    // console.log(sha512(result.user.uid));
    // console.log(!(signUpList.includes(sha512(result.user.uid))));
    // getMyChoices();
    // getOthersChoices();
  });
}

const logout = () => {
  // ログアウト処理
  setIsAuth(false);
  localStorage.clear();
}





return (


<>

<h1 align='center'>
令和5年度　化学・バイオ
<br />
研究室選択
</h1>
<center>
<p style={{'display':'inline', 'font-size':'13px'}}>現在</p>
  <p style={{'display':'inline', 'font-size':'20px'}}>{ userCount }</p>
  <p style={{'display':'inline', 'font-size':'13px'}}>人が登録中</p>
<br />
<br />
</center>


{ ( isAuth && signUpList.includes(sha512( ((localStorage.getItem('uid')) != null) ? (localStorage.getItem('uid')):('abc') )) ) ? (




<>
<center>ようこそ {localStorage.getItem('displayName')} さん
  <table>
    <tr>
      <td>
 
<button onClick={logout}>ログアウト</button>
      </td>
    </tr>
  </table>
  </center>

  {/* <h2 align='center'><font color="red">締切られました</font></h2>
  <h2 align='center'><font color="blue">研究室が確定しました</font></h2> */}


<br />
<br />
  
<table border='1px solid black' borderCollaps='collapse' align='center'>

<tr>
{/* {console.log(signUpList)} */}

<th>研究室名 <p style={{'display':'inline', 'font-size':'10px', 'opacity':'0.8'}}>(院免+第一志望人数/定員)</p></th>
<th>院免</th>
<th>第一希望</th>
<th>第二希望</th>
<th>第三希望</th>
</tr>


{
  labNames.map((labName, i) => {
    return (
      

      <tr>
        
        <td align='center'>
          {labName} 
          {/* <p style={{'display':'inline', 'font-size':'6px', 'opacity':'0.7'}}>第1志望</p> */}
          <p style={{'display':'inline', 'font-size':'20px', 'opacity':'0.8'}}> ({othersFirstChoices.filter(labIndex => labIndex === i).length + ((chosenLab[0]===i) ? 1: 0) + inmenLabNames[i]} <p style={{'display':'inline', 'font-size':'10px', 'opacity':'0.8'}}>/{capacity[i]}</p>)</p>
          {/* <p style={{'display':'inline', 'font-size':'6px', 'opacity':'0.7'}}>人</p>     */}
        </td>

        <td align='center'>
         <>
        {inmenLabNames[i]}
        </>
        </td>

        <td align='center'>
         <>
        {othersFirstChoices.map((labIndex) => labIndex==i ? <div>※</div>: <></> )}
        {inmenNames.includes(localStorage.getItem('displayName')) ? (
        <button className={chosenLab[0]==i ? 'kakuteime' : 'notme'}> 
        {chosenLab[0]==i ? '選択中' : '選択する'}
        </button>
        ):(
        <button onClick={() => {choseLab(0, i)}} className={chosenLab[0]==i ? 'kakuteime' : 'notme'}> 
        {chosenLab[0]==i ? '選択中' : '選択する'}
        </button>
        )}
        </>
        </td>
        

        <td align='center'>
         <>
        {othersSecondChoices.map((labIndex) => labIndex==i ? <div>※</div>: <></> )}
        {inmenNames.includes(localStorage.getItem('displayName')) ? (
        <button className={chosenLab[1]==i ? 'kakuteime' : 'notme'}> 
        {chosenLab[1]==i ? '選択中' : '選択する'}
        </button>
        ):(
        <button onClick={() => {choseLab(1, i)}} className={chosenLab[1]==i ? 'kakuteime' : 'notme'}> 
        {chosenLab[1]==i ? '選択中' : '選択する'}
        </button>
        )}
        </>
        </td>

        <td align='center'>
         <>
         {othersThirdChoices.map((labIndex) => labIndex==i ? <div>※</div>: <></> )}
         {inmenNames.includes(localStorage.getItem('displayName')) ? (
        <button className={chosenLab[2]==i ? 'kakuteime' : 'notme'}>  
        {chosenLab[2]==i ? '選択中' : '選択する'} 
        </button>
        ):(
        <button onClick={() => {choseLab(2, i)}} className={chosenLab[2]==i ? 'kakuteime' : 'notme'}>  
        {chosenLab[2]==i ? '選択中' : '選択する'} 
        </button>
        )}
        </>
        </td>   
      </tr>
    )
  })
}



</table>

<center>
    <br />
    <br />
    {/* <a href='https://hb.afl.rakuten.co.jp/hsc/25dae539.5fc082df.25dae53a.0f1e33ff/?link_type=pict&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJwaWN0IiwiY29sIjoxLCJjYXQiOiI0NCIsImJhbiI6IjQ2MDEzNSIsImFtcCI6ZmFsc2V9' target="_blank" rel="nofollow sponsored noopener" style={{'word-wrap':'break-word'}}>
    <img src="https://hbb.afl.rakuten.co.jp/hsb/25dae539.5fc082df.25dae53a.0f1e33ff/?me_id=1&me_adv_id=460135&t=pict" border="0" style={{'margin':'2px'}} alt="" title=""></img>
    </a> */}
  </center>
   
  


</>
):(
<>
<center>東北大学アカウントでログインしてください
  <table>
    <tr>
      <td>
<button onClick={login}>ログイン</button>
      
      </td>
    </tr>
  </table>
  </center>
  <br />
  <br />
</>


)}
</>

  );
}

export default App;