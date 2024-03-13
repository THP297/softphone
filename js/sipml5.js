import { Softphone } from "./softphone/softphone.js";

/*
 * SIP credentials
 */
const queryCredential = new URLSearchParams(window.location.search);
var Realm = queryCredential.get("Realm");
var PrivateIdentity = queryCredential.get("private");
var PublicIdentity = queryCredential.get("public");
var Password = queryCredential.get("webrtc_password");
var DisplayName = queryCredential.get("private");
var Ext_3CX;
try {
  Ext_3CX = queryCredential.get("private").substring(1);
} catch (e) {}

var Url_3CX = "https://bank-1-callcenter-concentrix.dxws.io:5001";
var integrationMode = queryCredential.get("integrationMode");

export var PhoneEvent = {
  RegisterByPublicPrivate(
    withPrivateIdentity,
    withPassword,
    withRealm,
    withPublicIdentity
  ) {
    if (!Realm) {
      Realm = withRealm;
    }
    PrivateIdentity = withPrivateIdentity;
    PublicIdentity = withPublicIdentity;
    Password = withPassword;
    DisplayName = withPrivateIdentity;
    initiateSIPRegister();
  },
  MakeCall(PhoneNumber) {
    // if (!isExternalPhoneValid(PhoneNumber).isValid || PhoneNumber.length < 10) {
    //   alert("SDT không hợp lệ");
    //   return;
    // }
    sipCall("call-audio", PhoneNumber);
  },
  Dialing(OrtherPartyNumber) {
    var originNumber = OrtherPartyNumber;

    if (OrtherPartyNumber.includes("+")) {
      originNumber = OrtherPartyNumber.split("+")[0];
    }
    postToParent("Dialing", originNumber);
  },
  Ringing(OrtherPartyNumber) {
    postToParent("Ringing", OrtherPartyNumber);
  },
  Ended(OrtherPartyNumber) {
    var originNumber = OrtherPartyNumber;

    if (OrtherPartyNumber.includes("+")) {
      originNumber = OrtherPartyNumber.split("+")[0];
    }
    postToParent("Ended", originNumber);
  },

  ConnectedByDialing(OrtherPartyNumber) {
    var originNumber = OrtherPartyNumber;

    if (OrtherPartyNumber.includes("+")) {
      originNumber = OrtherPartyNumber.split("+")[0];
    }
    postToParent("ConnectedByDialing", originNumber);
  },
  ConnectedByRinging(OrtherPartyNumber) {
    postToParent("ConnectedByRinging", OrtherPartyNumber);
  },
  Unregistered() {
    postToParent("Unregistered", null);
  },
  RegisteredSuccess() {
    postToParent("RegisteredSuccess", null);
    const message = "Register success !";
    const formLabel = document.querySelector("#form label");
    formLabel.innerHTML = message;
  },
};
function postToParent(event, message) {
  parent.postMessage(
    {
      event: event,
      message: message,
    },
    "*"
  );
}
window.addEventListener(
  "message",
  (event) => {
    console.log(event.data.event);
    if (event.data.event == "MakeCall") {
      PhoneEvent.MakeCall(event.data.message);
    }
    if (event.data.event == "ChangeContactName") {
      if (event.data.message) {
        SetContactName(event.data.message);
      }
    }
    if (event.data.event == "RegisterByPublicPrivate") {
      if (event.data.message.private && event.data.message.password) {
        sipUnRegister();
        PhoneEvent.RegisterByPublicPrivate(
          event.data.message.private,
          event.data.message.password
        );
      }
    }
  },
  false
);

window.onload = function () {
  //   HideAll();
  audioRemote = document.getElementById("audio_remote");

  SIPml.setDebugLevel("error");
  //   if (PrivateIdentity.length > 2) {
  //     PhoneEvent.RegisterByPublicPrivate(PrivateIdentity, Password);
  //   }
};
/*
ringtone
*/
var ringbacktone = new Audio("sounds/ringbacktone.wav");
ringbacktone.loop = true;
var ringtone = new Audio("sounds/ringtone.wav");
ringtone.loop = true;
var dtmfTone = new Audio("sounds/dtmf.wav");

dtmfTone.loop = true;
var canhBaoAudio = new Audio("sounds/CanhBaoCuocGoiDen.wav");

/*
 * credentials config
 */
var _websocket_proxy_url = `wss://uccx-2.dxws.io:8089/asterisk/ws`;
var _outbound_proxy_url = "";
var _ice_servers = "[]";
var _enable_rtcweb_breaker = false;
var _enable_early_ims = true;
var _enable_media_stream_cache = true;
var _bandwidth = "";
var _video_size = "";
var _sip_headers = [
  { name: "User-Agent", value: "IM-client/OMA1.0 sipML5-v1.2016.03.04" },
  { name: "Organization", value: "IDB" },
];
/*
 * event config
 */
var oSipStack, oSipSessionRegister, oSipSessionCall, oSipSessionTransferCall;

/*
 *  SIP config parameter
 */
var videoRemote, videoLocal, audioRemote;
var viewVideoLocal, viewVideoRemote, viewLocalScreencast;
var oConfigCall = {};

function initiateSIPConfig(ConfigType) {
  if (ConfigType == "3CX-audio") {
    oConfigCall = {
      audio_remote: audioRemote,
      video_local: viewVideoLocal,
      video_remote: viewVideoRemote,
      screencast_window_id: 0x00000000, // entire desktop
      bandwidth: { audio: undefined, video: undefined },
      video_size: {
        minWidth: undefined,
        minHeight: undefined,
        maxWidth: undefined,
        maxHeight: undefined,
      },
      events_listener: { events: "*", listener: onSipEventSession },
      sip_caps: [
        { name: "+g.oma.sip-im" },
        { name: "language", value: '"en,fr"' },
      ],
    };
  }
}

function initiateSIPRegister() {
  initiateSIPConfig("3CX-audio");
  if (!(Realm && PrivateIdentity && PublicIdentity && Password)) {
    return;
  }
  try {
    // create SIP stack
    oSipStack = new SIPml.Stack({
      realm: "uccx-2.dxws.io",
      impi: "200",
      impu: "sip:200-WS@uccx-2.dxws.io",
      password: "Alex200",
      display_name: "200-ws",
      websocket_proxy_url: _websocket_proxy_url,
      outbound_proxy_url: _outbound_proxy_url,
      ice_servers: _ice_servers,
      enable_rtcweb_breaker: _enable_rtcweb_breaker,
      /**/ events_listener: { events: "*", listener: onSipEventStack },
      enable_early_ims: _enable_early_ims, // Must be true unless you're using a real IMS network
      enable_media_stream_cache: _enable_media_stream_cache,
      bandwidth: _bandwidth ? tsk_string_to_object(_bandwidth) : null, // could be redefined a session-level
      video_size: _video_size ? tsk_string_to_object(_video_size) : null, // could be redefined a session-level
      sip_headers: _sip_headers,
    });
    if (oSipStack.start() != 0) {
      // HideAll();
    } else return;
  } catch (e) {
    alert("Lỗi:" + e);
  }
}
function sipUnRegister() {
  if (oSipStack) {
    oSipStack.stop(); // shutdown all sessions
  }
}

function onSipEventStack(e /*SIPml.Stack.Event*/) {
  switch (e.type) {
    case "started": {
      // catch exception for IE (DOM not ready)
      try {
        // LogIn (REGISTER) as soon as the stack finish starting
        oSipSessionRegister = this.newSession("register", {
          expires: 5,
          events_listener: { events: "*", listener: onSipEventSession },
          sip_caps: [
            { name: "+g.oma.sip-im", value: null },
            //{ name: '+sip.ice' }, // rfc5768: FIXME doesn't work with Polycom TelePresence
            { name: "+audio", value: null },
            { name: "language", value: '"en,fr"' },
          ],
        });
        oSipSessionRegister.register();
        PhoneEvent.RegisteredSuccess();
      } catch (e) {
        // alert("Lỗi register event stack:" + e);
        // HideAll();
      }
      break;
    }
    case "stopping":
    case "stopped":
    case "failed_to_start":
    case "failed_to_stop": {
      console.log(e);
      var bFailure = e.type == "failed_to_start" || e.type == "failed_to_stop";
      oSipStack = null;
      oSipSessionRegister = null;
      oSipSessionCall = null;

      stopRingbackTone();
      stopRingTone();
      HideAll();
      PhoneEvent.Unregistered();
      break;
    }

    case "i_new_call": {
      console.log(e);
      if (oSipSessionCall) {
        // do not accept the incoming call if we're already 'in call'
        e.newSession.hangup(); // comment this line for multi-line support
      } else {
        oSipSessionCall = e.newSession;
        // start listening for events
        oSipSessionCall.setConfiguration(oConfigCall);
        beginRinging(oSipSessionCall.getRemoteFriendlyName() || "unknown");
      }
      break;
    }

    case "m_permission_requested": {
      console.log(e);
      break;
    }
    case "m_permission_accepted":
    case "m_permission_refused": {
      if (e.type == "m_permission_refused") {
        alert("Vui lòng cho phép sử dụng thiết bị cho trang này!");
      }
      break;
    }

    case "starting":
    default:
      break;
  }
}

function onSipEventSession(e /* SIPml.Session.Event */) {
  switch (e.type) {
    case "connecting":
    case "connected": {
      var bConnected = e.type == "connected";
      if (e.session == oSipSessionRegister) {
      } else if (e.session == oSipSessionCall) {
        if (window.btnBFCP) window.btnBFCP.disabled = false;

        if (bConnected) {
          console.log(e);
          beginConnected();
          if (e.o_event.o_session.b_local) {
            dialConnected();
          } else {
            ringingConnected();
          }
        }
        if (SIPml.isWebRtc4AllSupported()) {
          // IE don't provide stream callback
          // uiVideoDisplayEvent(false, true);
          // uiVideoDisplayEvent(true, true);
        }
      }
      break;
    } // 'connecting' | 'connected'
    case "terminating":
    case "terminated": {
      if (e.session == oSipSessionRegister) {
        // uiOnConnectionEvent(false, false);

        oSipSessionCall = null;
        oSipSessionRegister = null;
      } else if (e.session == oSipSessionCall) {
        console.log(e);
        endcall();
      }
      break;
    } // 'terminating' | 'terminated'

    case "m_stream_video_local_added": {
      if (e.session == oSipSessionCall) {
        // uiVideoDisplayEvent(true, true);
      }
      break;
    }
    case "m_stream_video_local_removed": {
      if (e.session == oSipSessionCall) {
        // uiVideoDisplayEvent(true, false);
      }
      break;
    }
    case "m_stream_video_remote_added": {
      if (e.session == oSipSessionCall) {
        // uiVideoDisplayEvent(false, true);
      }
      break;
    }
    case "m_stream_video_remote_removed": {
      if (e.session == oSipSessionCall) {
        // uiVideoDisplayEvent(false, false);
      }
      break;
    }

    case "m_stream_audio_local_added":
    case "m_stream_audio_local_removed":
    case "m_stream_audio_remote_added":
    case "m_stream_audio_remote_removed": {
      break;
    }

    case "i_ect_new_call": {
      console.log(e);
      oSipSessionTransferCall = e.session;
      break;
    }

    case "i_ao_request": {
      if (e.session == oSipSessionCall) {
        console.log(e);
        var iSipResponseCode = e.getSipResponseCode();
        console.log(iSipResponseCode);
        if (iSipResponseCode == 180 || iSipResponseCode == 183) {
          progressDial();
        }
      }
      break;
    }

    case "m_early_media": {
      if (e.session == oSipSessionCall) {
        console.log(e);
        stopRingbackTone();
        stopRingTone();
      }
      break;
    }

    case "m_local_hold_ok": {
      if (e.session == oSipSessionCall) {
        if (oSipSessionCall.bTransfering) {
          oSipSessionCall.bTransfering = false;
          // this.AVSession.TransferCall(this.transferUri);
        }
        oSipSessionCall.bHeld = true;
      }
      break;
    }
    case "m_local_hold_nok": {
      if (e.session == oSipSessionCall) {
        oSipSessionCall.bTransfering = false;
      }
      break;
    }
    case "m_local_resume_ok": {
      if (e.session == oSipSessionCall) {
        oSipSessionCall.bTransfering = false;
        oSipSessionCall.bHeld = false;

        if (SIPml.isWebRtc4AllSupported()) {
          // IE don't provide stream callback yet
          uiVideoDisplayEvent(false, true);
          uiVideoDisplayEvent(true, true);
        }
      }
      break;
    }
    case "m_local_resume_nok": {
      if (e.session == oSipSessionCall) {
        oSipSessionCall.bTransfering = false;
      }
      break;
    }
    case "m_remote_hold": {
      if (e.session == oSipSessionCall) {
        txtCallStatus.innerHTML = "<i>Placed on hold by remote party</i>";
      }
      break;
    }
    case "m_remote_resume": {
      if (e.session == oSipSessionCall) {
        txtCallStatus.innerHTML = "<i>Taken off hold by remote party</i>";
      }
      break;
    }
    case "m_bfcp_info": {
      if (e.session == oSipSessionCall) {
        txtCallStatus.innerHTML = "BFCP Info: <i>" + e.description + "</i>";
      }
      break;
    }

    case "o_ect_trying": {
      if (e.session == oSipSessionCall) {
        txtCallStatus.innerHTML = "<i>Call transfer in progress...</i>";
      }
      break;
    }
    case "o_ect_accepted": {
      if (e.session == oSipSessionCall) {
        txtCallStatus.innerHTML = "<i>Call transfer accepted</i>";
      }
      break;
    }
    case "o_ect_completed":
    case "i_ect_completed": {
      if (e.session == oSipSessionCall) {
        txtCallStatus.innerHTML = "<i>Call transfer completed</i>";
        btnTransfer.disabled = false;
        if (oSipSessionTransferCall) {
          oSipSessionCall = oSipSessionTransferCall;
        }
        oSipSessionTransferCall = null;
      }
      break;
    }
    case "o_ect_failed":
    case "i_ect_failed": {
      if (e.session == oSipSessionCall) {
        txtCallStatus.innerHTML = "<i>Call transfer failed</i>";
        btnTransfer.disabled = false;
      }
      break;
    }
    case "o_ect_notify":
    case "i_ect_notify": {
      if (e.session == oSipSessionCall) {
        txtCallStatus.innerHTML =
          "<i>Call Transfer: <b>" +
          e.getSipResponseCode() +
          " " +
          e.description +
          "</b></i>";
        if (e.getSipResponseCode() >= 300) {
          if (oSipSessionCall.bHeld) {
            oSipSessionCall.resume();
          }
          btnTransfer.disabled = false;
        }
      }
      break;
    }
    case "i_ect_requested": {
      if (e.session == oSipSessionCall) {
        var s_message =
          "Do you accept call transfer to [" +
          e.getTransferDestinationFriendlyName() +
          "]?"; //FIXME
        if (confirm(s_message)) {
          txtCallStatus.innerHTML = "<i>Call transfer in progress...</i>";
          oSipSessionCall.acceptTransfer();
          break;
        }
        oSipSessionCall.rejectTransfer();
      }
      break;
    }
  }
}

function sipCall(s_type, phoneNum) {
  // if(!isExternalPhoneValid(phoneNum).isValid || phoneNum.length< 10){
  // 	alert("SDT không hợp lệ");
  // 	return;
  // }
  // alert("OK");
  if (oSipStack && !oSipSessionCall && !tsk_string_is_null_or_empty(phoneNum)) {
    if (s_type == "call-screenshare") {
      if (!SIPml.isScreenShareSupported()) {
        alert("Screen sharing not supported. Are you using chrome 26+?");
        return;
      }
      if (!location.protocol.match("https")) {
        if (
          confirm(
            "Screen sharing requires https://. Do you want to be redirected?"
          )
        ) {
          sipUnRegister();
          // HideAll();
          window.location = "https://ns313841.ovh.net/call.htm";
        }
        return;
      }
    }

    if (_bandwidth) {
      oConfigCall.bandwidth = tsk_string_to_object(_bandwidth);
    }
    if (_video_size) {
      oConfigCall.video_size = tsk_string_to_object(_video_size);
    }

    // create call session
    oSipSessionCall = oSipStack.newSession(s_type, oConfigCall);

    // make call
    if (oSipSessionCall.call(phoneNum) != 0) {
      oSipSessionCall = null;
      alert("Failed to make call");
      return;
    } else {
      tryingDial(phoneNum);
    }
  } else if (oSipSessionCall) {
    oSipSessionCall.accept(oConfigCall);
  }
}
export function sipHangUp() {
  if (oSipSessionCall) {
    oSipSessionCall.hangup({
      events_listener: { events: "*", listener: onSipEventSession },
    });
  }
}

function startRingTone() {
  try {
    ringtone.play();
  } catch (e) {}
}

function stopRingTone() {
  try {
    ringtone.pause();
  } catch (e) {}
}

function startRingbackTone() {
  try {
    ringbacktone.play();
  } catch (e) {}
}

function stopRingbackTone() {
  try {
    ringbacktone.pause();
  } catch (e) {}
}

async function startCanhBao() {
  try {
    canhBaoAudio.play();
  } catch (e) {}
}

var isInbound = false;
// Event

function tryingDial(phoneNum) {
  // HideAll();
  // ShowTalkingPhone();
  // StartTalkingWatch();
  var originNumber = phoneNum;

  if (phoneNum.includes("+")) {
    originNumber = phoneNum.split("+")[0];
  }
  // SetTalkingPhoneInfo("Call is in progress...", originNumber);
  if (integrationMode == "external") {
    PhoneEvent.Dialing(oSipSessionCall.getRemoteFriendlyName());
  } else {
    // WebRTC.Event.Dialing(oSipSessionCall.getRemoteFriendlyName());
  }
}
function progressDial() {}
function beginConnected() {
  console.log("in call");
  const softPhone = new Softphone();
  softPhone.inCall();
  stopRingbackTone();
  stopRingTone();

  // StartTalkingWatch();
  // HideAll();
  // ShowTalkingPhone();
  // SetTalkingPhoneInfo(
  //   "Đã kết nối",
  //   oSipSessionCall.getRemoteFriendlyName() || "unknown"
  // );
  // StartTalkingWatch();
}

function endcall() {
  if (integrationMode == "external") {
    PhoneEvent.Ended(oSipSessionCall.getRemoteFriendlyName());
  } else {
    const softPhone = new Softphone();
    softPhone.clientEndCall();
    console.log("end2");
    // WebRTC.Event.Ended(oSipSessionCall.getRemoteFriendlyName());
  }

  oSipSessionCall = null;
  // ChangeIsHold(false);
  stopRingbackTone();
  stopRingTone();
  // HideAll();
  // ShowAvailablePhone();
  // StopTalkingWatch();
  // SetContactName("Unknown");
  if (isInbound) {
    sipCall("call-audio", "callmarkdone");
    isInbound = false;
  }
}

function beginRinging(phoneNum_toShow) {
  startRingTone();
  HideAll();
  ShowIncommingPhone();
  SetIncommingCallPhoneInfo("", "", phoneNum_toShow);

  sipCall("call-audio", null);
  startCanhBao();
  if (integrationMode == "external") {
    PhoneEvent.Ringing(oSipSessionCall.getRemoteFriendlyName());
  } else {
    WebRTC.Event.Ringing(oSipSessionCall.getRemoteFriendlyName());
  }
}

function ringingConnected() {
  if (integrationMode == "external") {
    PhoneEvent.ConnectedByRinging(oSipSessionCall.getRemoteFriendlyName());
  } else {
    WebRTC.Event.ConnectedByRinging(oSipSessionCall.getRemoteFriendlyName());
  }
  isInbound = true;
}
function dialConnected() {
  if (integrationMode == "external") {
    PhoneEvent.ConnectedByDialing(oSipSessionCall.getRemoteFriendlyName());
  } else {
    // WebRTC.Event.ConnectedByDialing(oSipSessionCall.getRemoteFriendlyName());
  }
}

function innerClickToCall(phone, name) {
  sipCall("call-audio", phone);
}

window.addEventListener(
  "message",
  (event) => {
    if (event.data.func == "innerClickToCall") {
      innerClickToCall(event.data.message);
    }
  },
  false
);

function Queue_info(status, callback) {
  $.ajax({
    url: `${Url_3CX}/agent/queuestatus`,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic M0NYU1lTVEVNOm8xY1lkR1NkUVQ=",
    },
    data: JSON.stringify({ number: Ext_3CX, is_queue_login: status }),
    success: function (response, textStatus, jqXHR) {
      if (response && response.status == "OK") {
        callback();
      } else {
        alert(`Could not ${status ? "Login" : "Logout"}. Please try again!`);
      }
    },
  });
}

function sipToggleMute(callback) {
  if (oSipSessionCall) {
    var i_ret;
    var bMute = !oSipSessionCall.bMute;
    i_ret = oSipSessionCall.mute("audio" /*could be 'video'*/, bMute);
    if (i_ret != 0) {
      alert("Unmute failed");
      return;
    }
    oSipSessionCall.bMute = bMute;
    callback(bMute);
  }
}
function sipToggleHoldResume(callback) {
  if (oSipSessionCall) {
    var i_ret;
    i_ret = oSipSessionCall.bHeld
      ? oSipSessionCall.resume()
      : oSipSessionCall.hold();
    if (i_ret != 0) {
      alert("Hold / Resume failed");
      return;
    }
    oSipSessionCall.bHeld = !oSipSessionCall.bHeld;
    callback(oSipSessionCall.bHeld);
  }
}

function Status_info(status, callback) {
  $.ajax({
    url: `${Url_3CX}/agent/agentstatus`,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic M0NYU1lTVEVNOm8xY1lkR1NkUVQ=",
    },
    data: JSON.stringify({ number: Ext_3CX, status: status.softphoneName }),
    success: function (response, textStatus, jqXHR) {
      if (response && response.status == "OK") {
        callback(status);
      } else {
        alert(`Could not change your status. Please try again!`);
      }
    },
  });
}
