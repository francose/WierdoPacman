//Author : Sadik Erisen

import React, { Component } from 'react';

const log = console.log;
let i = 0;

function drawMap(ctx, size, pac, board, imgs){
    const brdSize = size * pac.size;
    const amount = 25;
    i++;
    for(const x in board){ 
        for(const y in board[x]){
            const val = board[x][y];
            if(val === 1){
                ctx.drawImage(imgs.borderImg, x * brdSize, y * brdSize, brdSize, brdSize);
            }else if(val === 2){
                ctx.save();
                ctx.translate(((x * brdSize) + (brdSize / 2)), ((y * brdSize) + (brdSize / 2)));
                ctx.rotate(Math.PI / 180 * pac.deg);
                ctx.translate(-((x * brdSize) + (brdSize / 2)), -((y * brdSize) + (brdSize / 2)));
                ctx.drawImage(i % 2 === 0 ? imgs.pac1 : imgs.pac2, (x * brdSize) - (pac.size / 2), (y * brdSize) - pac.size / 2, brdSize, brdSize);
                ctx.restore();
            }else{

            }
        }
    }
}

function isWithin(min, max, val){
    if(val > max || val < min) return false;
    return true;
}

class Board extends Component {
    constructor(props) {
        super(props);
        const board = [];
        for(let i = 0; i < 25; i++){
            board.push(new Array(25));
        }
        // 1 = wall
        // 2 = pac
        
        for(let i = 0; i < 25; i++){
            board[i][0] = 1;
            board[0][i] = 1;
            board[24][i] = 1;
            board[i][24] = 1;
        }

        for(const x of Array(120)){
            board[Math.round((Math.random() * 22 )+ 1)][Math.round((Math.random() * 22 )+ 1)] = 1;
        }

        this.center = 24 / 2;
        board[this.center][this.center] = 2;
        
        this.state = {
            pac: {
                size: .040,
                x: this.center,
                y: this.center,
                deg: 0
            },
            board
        }

        this.canvas = React.createRef();
        this.border = new Image();
        this.border.src = "http://i.imgur.com/3VQDeKc.png";
        this.border.onload = () => {
            this.setState({redraw: Math.random()})
        }

        this.pac = new Image();
        this.pac.src = "https://i.imgur.com/eUrqBOp.png";
        this.pac.onload = () => {
            this.setState({ redraw: Math.random() })
        }

        this.pac2 = new Image();
        this.pac2.src = "https://i.imgur.com/4BbKc0T.png";
        this.pac2.onload = () => {
            this.setState({redraw: Math.random()});
        }
        this.coin = new Image();
        this.coin.src =  "https://banner2.kisspng.com/20180702/eky/kisspng-monero-logo-cryptocurrency-ethereum-5b39a5ea4980e4.4914259515305046823011.jpg"
        this.coin.onload = () => {
            this.setState({ redraw: Math.random() });
        }
        
    }

    getSize = () => {
        const size = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) * 2;
        const style = {
            width: size / 2,
            height: size / 2,
            backgroundColor: "black"
        };
        this.setState({size, style});
    }

    init = () => {
        this.getSize(); 
        this.ctx = this.canvas.current.getContext("2d");
        this.code = 0;
    }

    componentDidUpdate(){
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.state.size, this.state.size);
        
        drawMap(this.ctx, this.state.size, this.state.pac, this.state.board, {
            borderImg: this.border,
            pac1: this.pac,
            pac2: this.pac2,
            coin: this.coin
        })
    }

    updatePac = () => {
        log(this.state);
        let canMove; 
        let newArr = [...this.state.board];
        let newPac = {...this.state.pac};
        switch (this.code) {
            case 38:
                log(this.state.pac);
                canMove = isWithin(1, 23, this.state.pac.y - 1);
                if (newArr[this.state.pac.x][this.state.pac.y - 1] === 1) canMove = false;
                if (!canMove) return this.setState({ redraw: Math.random() });
                newArr[this.state.pac.x][this.state.pac.y] = void 0;
                newArr[this.state.pac.x][this.state.pac.y - 1] = 2;

                newPac.y = newPac.y - 1;
                newPac.deg = 270;
                this.setState({
                    pac: newPac,
                    board: newArr
                });
                break;
            case 37:
                log(this.state.pac);
                canMove = isWithin(1, 23, this.state.pac.x - 1);
                if (newArr[this.state.pac.x - 1][this.state.pac.y] === 1) canMove = false;
                if (!canMove) return this.setState({ redraw: Math.random() });
                newArr[this.state.pac.x][this.state.pac.y] = void 0;
                newArr[this.state.pac.x - 1][this.state.pac.y] = 2;

                newPac.x = newPac.x - 1;
                newPac.deg = 180;
                this.setState({
                    pac: newPac,
                    board: newArr
                });
                break;
            case 40:
                log(this.state.pac);
                canMove = isWithin(1, 23, this.state.pac.y + 1);
                if(newArr[this.state.pac.x][this.state.pac.y + 1] == 1) canMove = false;
                if (!canMove) return this.setState({ redraw: Math.random() });
                newArr[this.state.pac.x][this.state.pac.y] = void 0;
                newArr[this.state.pac.x][this.state.pac.y + 1] = 2;

                newPac.y = newPac.y + 1;
                newPac.deg = 90;
                this.setState({
                    pac: newPac,
                    board: newArr
                });
                break;
            case 39:
                log(this.state.pac);
                canMove = isWithin(1, 23, this.state.pac.x + 1);
                if (newArr[this.state.pac.x + 1][this.state.pac.y] == 1) canMove = false;
                if (!canMove) return this.setState({ redraw: Math.random() });
                newArr[this.state.pac.x][this.state.pac.y] = void 0;
                newArr[this.state.pac.x + 1][this.state.pac.y] = 2;

                newPac.x = newPac.x + 1;
                newPac.deg = 0;
                this.setState({
                    pac: newPac,
                    board: newArr
                });
                break;
        }
    }

    componentDidMount(){
        this.bindedGetSize = this.getSize.bind(this);
        window.addEventListener("resize", this.bindedGetSize);
        // this.int = setInterval(this.updatePac, 250);
        window.onkeydown = e => {
            switch(e.keyCode || e.which){
                case 37:
                    this.code = 37;
                    break;
                case 38: 
                    this.code = 38;
                    break;
                case 39: 
                    this.code = 39;
                    break;
                case 40:
                    this.code = 40;
                    break;
            }
        }
        this.init();
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.bindedGetSize);
    }

    render() {
        return (
            <div className="Container" style={styles.container}>
                <canvas ref={this.canvas} width={this.state.size} height={this.state.size} style={this.state.style}/>
            </div>
        );
    }
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center"
    },
   pacman:{
       position :'relative',
       background: 'yellow',
       height: '100px',
       width:'100px',
       borderRadius:'50%',       
   },
   eyes:{
       position:'relative',
       background:'red',
       height:'20px',
       width:'20px',
       borderRadius:'50%',
       top:'15px',
       left:'60px'
   }
};

export default Board;