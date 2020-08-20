<template>
  <div class="chat-box">
    <header>群聊人数：{{ count }}</header>
    <div class="msg-box" ref="msg-box">
      <div
        v-for="(i, index) in list"
        :key="index"
        class="msg"
        :style="i.userId == userId ? 'flex-direction:row-reverse' : ''"
      >
        <div class="user-head">
          <div
            class="head"
            :style="` background: hsl(${getUserHead(
              i.userId,
              'bck',
            )}, 88%, 62%); clip-path:polygon(${getUserHead(
              i.userId,
              'polygon',
            )}% 0,100% 100%,0% 100%); transform: rotate(${getUserHead(
              i.userId,
              'rotate',
            )}deg)`"
          ></div>
        </div>
        <div class="user-msg">
          <span
            :style="i.userId == userId ? ' float: right;' : ''"
            :class="i.userId == userId ? 'right' : 'left'"
            >{{ i.content }}</span
          >
        </div>
      </div>
    </div>
    <div class="input-box">
      <input
        type="text"
        ref="sendMsg"
        v-model="contentText"
        @keyup.enter="sendText()"
      />
      <div
        class="btn"
        :class="{ ['btn-active']: contentText }"
        @click="sendText()"
      >
        发送
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { get_query, getBrowser } from "@/utils/utils.ts";
// import VueQrcode from "@xkeshi/vue-qrcode";
// Vue.component(VueQrcode.name, VueQrcode);
@Component({
  name: "socket",
  components: {},
})
export default class Ipage extends Vue {
  /* Data */
  private ws: any = null;
  private count: number = 0;
  private userId: any = null; // 当前用户ID
  private list: string[] = []; // 聊天记录的数组
  private contentText: string = ""; // input输入的值

  @Watch("status")
  private getstatus(newVal: string) {
    // console.log("状态", newVal);
  }
  /* Computed */
  // get myIndex() {return ''}

  /* Hook */
  private created() {
    this.getUserID();
  }
  private mounted() {
    this.initWebSocket();
  }

  /* Function */
  private myFun() {}
  // 根据时间戳作为当前用户ID
  private getUserID() {
    const time = new Date().getTime();
    this.userId = time;
  }
  // 根据userID生成一个随机头像
  private getUserHead(id: any, type: any) {
    const ID = String(id);
    if (type === "bck") {
      return Number(ID.substring(ID.length - 3));
    }
    if (type === "polygon") {
      return Number(ID.substring(ID.length - 2));
    }
    if (type === "rotate") {
      return Number(ID.substring(ID.length - 3));
    }
  }
  // 滚动条到底部
  private scrollBottm() {
    const el: any = this.$refs["msg-box"];
    el.scrollTop = el.scrollHeight;
  }
  // 发送聊天信息
  private sendText() {
    const _this: any = this;
    _this.$refs["sendMsg"].focus();
    if (!_this.contentText) {
      return;
    }
    const params = {
      userId: _this.userId,
      msg: _this.contentText,
    };
    _this.ws.send(JSON.stringify(params)); // 调用WebSocket send()发送信息的方法
    _this.contentText = "";
    setTimeout(() => {
      _this.scrollBottm();
    }, 500);
  }
  // 进入页面创建websocket连接
  private initWebSocket() {
    const _this: any = this;
    // 判断页面有没有存在websocket连接
    if (window.WebSocket) {
      // http://192.168.11.215:8080/ 是我本地IP地址 此处的 :8181 端口号 要与server文件夹配置端口的一致
      const ws = new WebSocket("ws://192.168.11.215:8181");
      _this.ws = ws;
      ws.onopen = function (e) {
        console.log("服务器连接成功");
      };
      ws.onclose = function (e) {
        console.log("服务器连接关闭");
      };
      ws.onerror = function () {
        console.log("服务器连接出错");
      };
      ws.onmessage = function (e) {
        // 接收服务器返回的数据
        const resData = JSON.parse(e.data);
        if (resData.funName === "userCount") {
          _this.count = resData.users;
          _this.list = resData.chat;
          console.log(resData.chat);
        } else {
          _this.list = [
            ..._this.list,
            { userId: resData.userId, content: resData.msg },
          ];
        }
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-box {
  margin: 0 auto;
  background: #fafafa;
  position: relative;
  height: 100%;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  header {
    position: fixed;
    width: 100%;
    height: 1rem;
    background: #409eff;
    max-width: 750px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: white;
    font-size: 0.24rem;
  }
  .msg-box {
    position: absolute;
    height: calc(100% - 2.4rem);
    width: 100%;
    margin-top: 1rem;
    overflow-y: scroll;
    .msg {
      width: 95%;
      min-height: 1.5rem;
      margin: 1rem 0.5rem;
      position: relative;
      display: flex;
      justify-content: flex-start !important;
      .user-head {
        min-width: 1.5rem;
        width: 20%;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: #f1f1f1;
        display: flex;
        justify-content: center;
        align-items: center;
        .head {
          width: 1rem;
          height: 1rem;
        }
        // position: absolute;
      }
      .user-msg {
        width: 80%;
        // position: absolute;
        word-break: break-all;
        position: relative;
        z-index: 5;
        span {
          display: inline-block;
          padding: 0.4rem 0.5rem;
          border-radius: 0.5rem;
          margin-left: 0.2rem;
          font-size: 0.44rem;
        }
        .left {
          background: white;
          animation: toLeft 0.5s ease both 1;
        }
        .right {
          background: #53a8ff;
          color: white;
          animation: toright 0.5s ease both 1;
        }
        @keyframes toLeft {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
        @keyframes toright {
          0% {
            opacity: 0;
            transform: translateX(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }
      }
    }
  }
  .input-box {
    padding: 0 0.5rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1.5rem;
    background: #fafafa;
    box-shadow: 0 0 5px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      height: 1.5rem;
      display: inline-block;
      width: 100%;
      padding: 0 0.5rem 0 0;
      border: none;
      border-radius: 0.2rem;
      font-size: 0.32rem;
    }
    .btn {
      height: 1rem;
      line-height: 1rem;
      min-width: 2rem;
      background: #e0e0e0;
      font-size: 0.32rem;
      color: white;
      text-align: center;
      border-radius: 0.2rem;
      margin-left: 0.5rem;
      transition: 0.5s;
    }
    .btn-active {
      background: #409eff;
    }
  }
}
</style>
