   class Game {
       //构造函数
       constructor() {
           //第一位棋手的名字
           this.playerl = null;
           //第二位棋手的名字
           this.player2 = null;
           //观众集合
           this.visitor = [];
           //游戏是否开始
           this.begin = false;
           //游戏是否结束
           this.gameover = false;
           //
           this.lastChoose = '';
           //存储游戏步骤
           this.actions = [];
           //所有棋手的socket对象
           this.guest = []; //当前下棋的棋手
           this.movePlayer = null;
       }

       /**
       *用户加入游戏
       * @username
       玩家名称
       * @guest
       Socket对象
       用户类型
       * return
       **/
       addPlayer(username, guest) {
               //如果第一位棋手不存在
               if (!this.playerl) {
                   //存储棋手的名称
                   this.playerl = username; //存储 socket对象
                   this.guest[0] = guest; //加入的是第一位棋手
                   return 1
                       //如果第二位棋手不存在
               } else if (!this.player2) {
                   //存储棋手的名称
                   this.player2 = username; //存储socket对象
                   this.guest[1] = guest; //加入的是第二位棋手
                   return 2
                       //如果两位棋手的名称相同
               } else if (this.playerl === username || this.player2) {
                   //名称无效
                   return 0;
                   //不是棋手，就是观众
               } else {
                   //存储观众
                   this.visitor.push(username)
                       //加入的是观众
                   return 3;
               }
           }
           /**
           游戏开始检测
           游戏是否开始
           * return  游戏是否开始
           ***/
       start() {
               if (this.playerl && this.player2) {
                   this.begin = true;
               } else {
                   this.begin = false;
               }
               return this.begin;
           }
           // true表示棋手没有连续下棋，下次有效；false表示棋手连续下棋，下次无
           // 检测玩家是否连续下棋
           // 玩家名称
           // eusername
           // return
       checkChoose(username) {
               //检测下棋的棋手名称与上一步下棋的棋手名字是否相同
               return this.movePlayer !== username
           }
           /**
           *玩家下棋
           玩家名称
           * @username
           ***/
       playerMove(username) {
               //存储本次下棋的棋手名称
               this.movePlayer = username
           }
           /**
           *存储动作
           本次下棋的状态信息
           * @res
           ***/
       saveActions(res) {
               //存储下棋信息
               this.actions.push(res)
           }
           /**
            *玩家获胜，游戏结束***/
       win() {
               //游戏结束
               this.gameover = true;
           }
           /**
           ﹡玩家离开
           ***/
       userLeave(username) {
           //如果是第一位玩家，移除第一位玩家的名称
           username === this.playerl ? (this.playerl = null) :
               //如果是第二位玩家，移除第二位玩家的名称
               username === this.player2 ? (this.player2 = null) :
               //如果是观众，移除该观众
               ~this.visitor.indexOf(username) && this.visitor.splice(this(username), 1)
       }
   }

   module.exports = Game;