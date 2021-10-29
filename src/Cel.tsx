import { MouseEventHandler } from 'react';
import './Cel.css';


interface CelProps {
   owner: number,
   active: boolean,
   fallDown: number,
   moved: number,
   winner: boolean,
   onClick: MouseEventHandler,
   onMouseEnter: MouseEventHandler
}

const Cel = (props: CelProps): JSX.Element => {

   let cssClassWrapper = 'cel-wrapper';
   cssClassWrapper += props.fallDown === -1 ? '' : ' cel-fall-down-p'+props.fallDown;
   cssClassWrapper += props.moved === -1 ? '' : ' cel-moved-p'+props.moved;

   let cssClassInner = 'cel';
   cssClassInner += props.owner == null ? '' : ' cel-player-'+props.owner;
   cssClassInner += props.active ? ' cel-active' : '';

   let cssClassWinner = 'cel-winner';
   cssClassWinner += props.winner ? ' cel-winner-visible' : '';

   return (
      <div className={cssClassWrapper}>
         <div
            className={cssClassInner}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
         >
            <div className={cssClassWinner}></div>
         </div>
      </div>
   );
}

export default Cel;