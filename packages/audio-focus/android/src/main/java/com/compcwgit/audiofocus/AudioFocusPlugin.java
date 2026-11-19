package com.compcwgit.audiofocus;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// 앱이 말하는 동안 다른 앱 소리(음악·유튜브)를 멈추지 않고 잠깐 줄임
// duck(): 오디오 포커스 GAIN_TRANSIENT_MAY_DUCK 요청 → 안드로이드가 다른 앱 소리를 줄여 줌
// release(): 포커스 돌려줌 → 다른 앱 소리가 원래대로
@CapacitorPlugin(name = "AudioFocus")
public class AudioFocusPlugin extends Plugin {

    private AudioManager am;
    private AudioFocusRequest request; // Android 8.0+
    private final AudioManager.OnAudioFocusChangeListener listener = (change) -> {};

    @Override
    public void load() {
        am = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
    }

    @PluginMethod
    public void duck(PluginCall call) {
        if (am != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (request == null) {
                    // 길안내 음성처럼: 음악은 계속, 소리만 잠깐 작게
                    AudioAttributes attrs = new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build();
                    request = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                        .setAudioAttributes(attrs)
                        .setOnAudioFocusChangeListener(listener)
                        .build();
                }
                am.requestAudioFocus(request);
            } else {
                am.requestAudioFocus(listener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK);
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void release(PluginCall call) {
        if (am != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (request != null) am.abandonAudioFocusRequest(request);
            } else {
                am.abandonAudioFocus(listener);
            }
        }
        call.resolve();
    }
}
