import { Component } from 'react';
import Board from  './Board';
import WinnerTab from './WinnerTab';
import './App.css';


export interface ShiftChangeUIHandlerType {
   (player: number): void
}

export interface WinnerTabHandlerType {
   (winner: number): Promise<void>
}

export interface ResetHandlerType {
   (): void
}

interface AppState {
   winner: number,
   currentPlayer: number
}

export default class App extends Component<any, AppState> {

   private resetDone_callable: any;

   public constructor(props: any) {
      super(props);

      this.winnerTabHandler = this.winnerTabHandler.bind(this);
      this.resetHandler = this.resetHandler.bind(this);
      this.shiftChangeUIHandler = this.shiftChangeUIHandler.bind(this);

      this.state = {
         currentPlayer: 0,
         winner: -1
      };
   }

   public shiftChangeUIHandler(player: number): void {
      this.setState({currentPlayer: player});
   }

   public async winnerTabHandler(winner: number): Promise<void> {
      this.setState({winner: winner});
      await new Promise(res => {this.resetDone_callable = res});
   }

   public resetHandler(): void {
      this.setState({winner: -1});
      this.resetDone_callable();
   }
   
   public render(): JSX.Element {
      return (
         <div className="App">
            <WinnerTab
               winner={this.state.winner !== -1 ? this.state.winner : 0}
               hidden={this.state.winner === -1}
               resetHandler={this.resetHandler}   
            />
            <header className="Title">
               <h1>4 en Raya</h1>
            </header>
            <Board
               xLength={7}
               yLength={6}
               winnerTabHandler={this.winnerTabHandler}
               shiftChangeUIHandler={this.shiftChangeUIHandler}
            />
         </div>
      )
   }
}