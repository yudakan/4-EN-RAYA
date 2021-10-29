import { MouseEvent } from 'react';
import { ResetHandlerType } from './App';
import './WinnerTab.css';


interface WinnerTabProps {
   winner: number,
   hidden: boolean,
   resetHandler: ResetHandlerType;
}

const WinnerTab = (props: WinnerTabProps): JSX.Element => {

   let cssClass = 'winner-tab-p'+props.winner;
   cssClass += props.hidden ? '' : ' winner-active';

   return (
      <div className={cssClass}>
         <div className="winner-inner-wrapper">
            <h2>Yow win ^o^ !</h2>
            <div className="winner-row">
               <a href="#" onClick={(event:MouseEvent) => props.resetHandler()}>New Game ò.ó</a>
               <a href="https://twitter.com/lolevercelle/status/1376372731604705281?s=1002" target='_blank'>Xiao x Venti &lt;3</a>
            </div>
         </div>
      </div>
   );
}

export default WinnerTab;