import { async, getDefaultAppConfig } from '@firebase/util';
import { signInWithPopup } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import {useEffect, useState} from 'react';
import './App.css';
import { auth, db, provider } from './firebase';
import './App.css'



function App() {

const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));
let labNames = ['松本', '冨重', '三ツ石', '滝沢', '浅井', '大井', '青木', '長尾', '北川', '久保', '渡邊', '溶媒要素技術部(旧猪俣研)', '中山', '珠玖', '服部', '魚住', '梅津', '吉岡', '壹岐', '福島', '芥川', '中川', '陣内', '加藤', '西原', '笠井', '本間', '村松', '西堀', '殷', '蟹江', '(旧)超臨界ナノ工学分野'];

const [othersFirstChoices, setOthersFirstChoices] = useState([]);
const [othersSecondChoices, setOthersSecondChoices] = useState([]);
const [othersThirdChoices, setOthersThirdChoices] = useState([]);

const [chosenLab, setChosenLab] = useState([null, null, null]);
  
  useEffect(() => {
    
 

  const getMyChoices = async() => {
    const docRef = doc(db, "choices", localStorage.getItem('email'));
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      setChosenLab(docSnap.data().choices);
    }
  }

  getMyChoices();

  const getOthersChoices = async() => {
    const data = await getDocs(collection(db, 'choices'));
   
    setOthersFirstChoices([]);
    setOthersSecondChoices([]);
    setOthersThirdChoices([]);
    
    data.docs.map((doc) => {
      if (doc.id != localStorage.getItem('email')) { 
        setOthersFirstChoices((prevState) => ([...prevState, doc.data().choices[0]]))
        setOthersSecondChoices((prevState) => ([...prevState, doc.data().choices[1]]))
        setOthersThirdChoices((prevState) => ([...prevState, doc.data().choices[2]]))
      }
    })
  };
  
  getOthersChoices();
  
  const unsubscribe = onSnapshot(collection(db, 'choices'), (snapshot) => {
    
    getOthersChoices()
  
  });
}, []);




const choseLab = (priority, labIndex) => {

  const chosenLabList = [...chosenLab]

  
  chosenLab.map((aChosenLab, priorityIndex) => {
    if (priorityIndex === priority) {
      chosenLabList[priorityIndex] = labIndex
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
  await setDoc(doc(db, 'choices', localStorage.getItem('email')), {
    choices: chosenLabList,
    author: auth.currentUser.displayName,
    id: auth.currentUser.uid
  })
}

const login = () => {
  // ログイン処理
  signInWithPopup(auth, provider).then((result) => {
    
    setIsAuth(true);
    localStorage.setItem('isAuth', true);
    localStorage.setItem('email', result.user.email);
   
  });
}

const logout = () => {
  // ログアウト処理
  setIsAuth(false);
  localStorage.clear()
}





return (


<>

<h1 align='center'>
令和5年度　化学・バイオ
<br />
研究室選択
</h1>


{ isAuth ? (




<>
<center>ようこそ {localStorage.getItem('email')} さん
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


<th>研究室名</th>
<th>第一希望</th>
<th>第二希望</th>
<th>第三希望</th>
</tr>


{
  labNames.map((labName, i) => {
    return (
      

      <tr>
        
        <td align='center'>{labName}</td>

        <td align='center'>
         <>
        {othersFirstChoices.map((labIndex) => labIndex==i ? <div>※</div>: <></> )}
        <button onClick={() => {choseLab(0, i)}} className={chosenLab[0]==i ? 'kakuteime' : 'notme'}> 
        {chosenLab[0]==i ? '選択中' : '選択する'}
        </button>
        </>
        </td>
        

        <td align='center'>
         <>
        {othersSecondChoices.map((labIndex) => labIndex==i ? <div>※</div>: <></> )}
        <button onClick={() => {choseLab(1, i)}} className={chosenLab[1]==i ? 'kakuteime' : 'notme'}>  
        {chosenLab[1]==i ? '選択中' : '選択する'}
        </button>
        </>
        </td>

        <td align='center'>
         <>
         {othersThirdChoices.map((labIndex) => labIndex==i ? <div>※</div>: <></> )}
        <button onClick={() => {choseLab(2, i)}} className={chosenLab[2]==i ? 'kakuteime' : 'notme'}>  
        {chosenLab[2]==i ? '選択中' : '選択する'} 
        </button>
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
<center>ログインしてください
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