import { Component, MouseEvent } from 'react';
import { WinnerTabHandlerType, ShiftChangeUIHandlerType } from './App';
import Cel from './Cel'


interface BoardProps {
   xLength: number,
   yLength: number,
   winnerTabHandler: WinnerTabHandlerType,
   shiftChangeUIHandler: ShiftChangeUIHandlerType
}

class CelFX {
   public hover: boolean;
   public fallDown: number;
   public moved: number;
   public winner: boolean;

   public constructor(hover=false, fallDown=-1, moved=-1, winner=false) {
      this.hover = hover;
      this.fallDown = fallDown;
      this.moved = moved;
      this.winner = winner;
   }
}

class GameState {
   public cels: Array<Array<number>>;
   public celsFX: Array<Array<CelFX>>;
   public player0IsCurrent: boolean;

   public constructor(yLength: number, xLength: number) {
      this.cels = Array(yLength).fill(null).map(() => Array(xLength).fill(null));
      this.celsFX = Array(yLength).fill(null).map(
         () => Array(xLength).fill(null).map(
            () => new CelFX()
         )
      );
      this.player0IsCurrent = true;
   }
}

export default class Board extends Component<BoardProps, GameState> {

   mouseEnabled: boolean;

   public constructor(props: BoardProps) {
      super(props);

      this.mouseEnabled = true;
      this.onMouseLeave = this.onMouseLeave.bind(this);

      this.state = new GameState(props.yLength, props.xLength);
   }

   public onMouseLeave(): void {
      if (this.mouseEnabled)
         this.setState({
            celsFX: Array(this.props.yLength).fill(null).map(
               () => Array(this.props.xLength).fill(null).map(
                  () => new CelFX()
               )
            )
         });
   }

   public async endGame(player: number): Promise<void> {
      await new Promise(res => setTimeout(res, 2000));
      await this.props.winnerTabHandler(player);
      this.setState(new GameState(this.props.yLength, this.props.xLength));
      this.props.shiftChangeUIHandler(this.state.player0IsCurrent ? 0 : 1);

   }

   public static game(curr_x: number, curr_y: number, player: number, cels: Array<Array<number>>): Array<Array<number>> {

      let winnerCels = [];

      // column
      for (let y = curr_y; y < cels.length; y++)
         if (cels[y][curr_x] === player) winnerCels.push([y, curr_x]);
         else break;

      if (winnerCels.length >= 4) return winnerCels;

      // row
      winnerCels = [];
      for (let x = curr_x; x < cels[0].length; x++)
         if (cels[curr_y][x] === player) winnerCels.push([curr_y, x])
         else break;
      for (let x = curr_x - 1; x >= 0; x--)
         if (cels[curr_y][x] === player) winnerCels.push([curr_y, x])
         else break;

      if (winnerCels.length >= 4) return winnerCels;

      // diagonal \
      winnerCels = [];
      for (let y = curr_y, x = curr_x; y < cels.length && x < cels[0].length; y++, x++)
         if (cels[y][x] === player) winnerCels.push([y, x])
         else break;
      for (let y = curr_y - 1, x = curr_x - 1; y >= 0 && x >= 0; y--, x--)
         if (cels[y][x] === player) winnerCels.push([y, x])
         else break;

      if (winnerCels.length >= 4) return winnerCels;

      // diagonal /
      winnerCels = [];
      for (let y = curr_y, x = curr_x; y < cels.length && x >= 0; y++, x--)
         if (cels[y][x] === player) winnerCels.push([y, x])
         else break;
      for (let y = curr_y - 1, x = curr_x + 1; y >= 0 && x < cels[0].length; y--, x++)
         if (cels[y][x] === player) winnerCels.push([y, x])
         else break;

      if (winnerCels.length >= 4) return winnerCels;

      return winnerCels;
   }

   public async movement(curr_x: number): Promise<void> {

      const updatedCels = this.state.cels.map(arr => arr.slice());

      // set movement ;-;
      let player = this.state.player0IsCurrent ? 0 : 1;
      let curr_y = NaN;

      for (let y = this.props.yLength - 1; y >= 0; y--) {
         if (updatedCels[y][curr_x] == null) {
            updatedCels[y][curr_x] = player;
            curr_y = y;
            break;
         }
      }

      if (isNaN(curr_y)) {
         alert('Movement not allowed u_u');
         return;
      }

      // movement animation
      for (let y = 0; y < this.props.yLength; y++)
         if (updatedCels[y][curr_x] == null && (y + 1 < this.props.yLength || updatedCels[y + 1][curr_x] == null)) {
            await new Promise(res => setTimeout(() => {
               const updatedCelsFX = this.state.celsFX.map(arr => arr.slice());
               updatedCelsFX[y][curr_x].fallDown = player;
               this.setState({ celsFX: updatedCelsFX });
               res(null);
            }, 100));
         }
         else break;

      await new Promise(res => setTimeout(() => {
         const updatedCelsFX = this.state.celsFX.map(arr => arr.slice());
         updatedCelsFX[curr_y][curr_x].moved = player;
         this.setState({ celsFX: updatedCelsFX });
         res(null);
      }, 100));

      this.setState({cels: updatedCels});
      this.props.shiftChangeUIHandler(this.state.player0IsCurrent ? 0 : 1);

      // check if winner ò.O
      const winnerCels = Board.game(curr_x, curr_y, player, updatedCels);
      if (winnerCels.length >= 4) {

         for (let x=0; x < this.props.xLength; x++)
            await new Promise(res => setTimeout(() => {
               this.handleColHover(x, true, false);
               res(null);
            }, 100));

         for (const wcel of winnerCels)
            await new Promise(res => setTimeout(() => {
               const updatedCelsFX = this.state.celsFX.map(arr => arr.slice());
               updatedCelsFX[wcel[0]][wcel[1]].winner = true;
               this.setState({ celsFX: updatedCelsFX });
               res(null);
            }, 100));

         await this.endGame(player);
      }
      else {

         // clean animations
         const cleanCelsFX = Array(this.props.yLength).fill(null).map(
            () => Array(this.props.xLength).fill(null).map(
               (val, col) => new CelFX(col === curr_x)
            )
         );

         await new Promise(res => setTimeout(res, 500));

         this.setState({
            celsFX: cleanCelsFX,
            player0IsCurrent: !this.state.player0IsCurrent
         });
      }
   }


   /* --- Cels --- */

   public async handleCelClick(y: number, x: number): Promise<void> {
      console.log(`Cel Clicked: ${x + 1}x ${y + 1}y`);

      if (this.mouseEnabled) {
         this.mouseEnabled = false;

         if (!this.state.celsFX[y][x].hover) this.handleColHover(x, true);
         await this.movement(x);

         this.mouseEnabled = true;
      }
   }

   public handleColHover(x: number, allowMouse=false, clean=true): void {
      if (this.mouseEnabled || allowMouse) {
         const updatedCelsFX = this.state.celsFX.map(arr => arr.slice());
         updatedCelsFX.forEach(arr => arr.forEach(
            (celFX, col) => col === x
               ? celFX.hover = true
               : clean && (celFX.hover = false))
         );
         this.setState({ celsFX: updatedCelsFX });
      }
   }

   public renderCel(y: number, x: number): JSX.Element {
      return (<Cel
         key={(y * this.props.xLength + x).toString()}
         owner={this.state.cels[y][x]}
         active={this.state.celsFX[y][x].hover}
         fallDown={this.state.celsFX[y][x].fallDown}
         moved={this.state.celsFX[y][x].moved}
         winner={this.state.celsFX[y][x].winner}
         onClick={(event: MouseEvent) => this.handleCelClick(y, x)}
         onMouseEnter={(event: MouseEvent) => this.handleColHover(x)}
      />);
   }


   public render(): JSX.Element {

      const rows = [];
      for (let y=0; y < this.props.yLength; y++) {

         const cols = [];
         for (let x=0; x < this.props.xLength; x++)
            cols.push(this.renderCel(y, x));

         rows.push(<div className="row" key={y.toString()}>{cols}</div>);
      }

      return (
         <div
            className="Board"
            onMouseLeave={this.onMouseLeave}
         >{rows}</div>
      );
   }
}