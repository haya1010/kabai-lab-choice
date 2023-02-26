import { async, getDefaultAppConfig } from '@firebase/util';
import { signInWithPopup } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import {useEffect, useState} from 'react';
import './App.css';
import { auth, db, provider } from './firebase';


function App() {

const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));
let labNames = ['松本', '冨重', '三ツ石', '滝沢', '浅井'];

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
    console.log('changed');
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
令和5年度　化学・バイオ工学研究室選択
</h1>
{ isAuth ? (
<button onClick={logout}>ログアウト</button>
):(
<button onClick={login}>ログイン</button>
)}

{ isAuth ? (




<>
<center>ようこそ {localStorage.getItem('email')} さん
  <table>
    <tr>
      <td>
      { isAuth ? (
<button onClick={logout}>ログアウト</button>
):(
<button onClick={login}>ログイン</button>
)}
      </td>
    </tr>
  </table>
  

  </center>

  <h2 align='center'><font color="red">締切られました</font></h2>
  <h2 align='center'><font color="blue">研究室が確定しました</font></h2>



  
<table border='1px solid black' borderCollaps='collapse' align='center'>

<tr>

<th>番号</th>
<th>研究室名</th>
<th>第一希望</th>
<th>第二希望</th>
<th>第三希望</th>
</tr>


{
  labNames.map((labName, i) => {
    return (
      


      <tr>
        <td align="center">{i+1}</td>
        <td align='center'>{labName}</td>

        <td align='center'>
         <>
        <button onClick={() => {choseLab(0, i)}} style={chosenLab[0]==i ? {color: 'red'} : {color: 'black'}}> 
        <p>{chosenLab[0]==i ? '選択中' : '選択する'}</p>
        
        
        {/* {chosenLab[0]==i ? (
          <p>選択中</p>
        ):(
          <p>選択する</p>
        )
        }  */}
        </button>{'※'.repeat(othersFirstChoices.filter(c => c == i).length)}
        </>
        </td>
        

        <td align='center'>
         <>
        <button onClick={() => {choseLab(1, i)}} style={chosenLab[1]==i ? {color: 'red'} : {color: 'black'}}>  
        {chosenLab[1]==i ? (
          <p>選択中</p>
        ):(
          <p>選択する</p>
        )
        } 
        </button>{'※'.repeat(othersSecondChoices.filter(c => c == i).length)}
        </>
        </td>

        <td align='center'>
         <>
        <button onClick={() => {choseLab(2, i)}} style={chosenLab[2]==i ? {color: 'red'} : {color: 'black'}}>  
        {chosenLab[2]==i ? (
          <p>選択中</p>
        ):(
          <p>選択する</p>
        )
        } 
        </button>{'※'.repeat(othersThirdChoices.filter(c => c == i).length)}
        </>
        </td>

      
        

        
        
        
      </tr>
    )
  })
}



</table>



</>
):(
<p>ログインしろー</p>
)}
</>

  );
}

export default App;
