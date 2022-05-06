package com.tooliv.server.domain.channel.application.dto.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@ApiModel("ChatDirectDTO")
@NoArgsConstructor
@Getter
@Builder
@AllArgsConstructor
public class ChatDirectDTO implements Serializable {

    @ApiModelProperty(name = "메시지 ID")
    private long chatId;

    @ApiModelProperty(name = "채팅방 ID")
    private String channelId;

    @ApiModelProperty(name = "보내는사람 Id")
    private String senderEmail;

    @ApiModelProperty(name = "받는사람 Id")
    private String receiverEmail;

    @ApiModelProperty(name = "내용")
    private String contents;

    @ApiModelProperty(name = "보낸시간")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime sendTime;

    @ApiModelProperty(name = "파일")
    private List<String> files;

    @ApiModelProperty(name = "파일 이름")
    private List<String> originFiles;

    public void updateFiles(List<String> files,List<String> originFiles) {
        this.files = files;
        this.originFiles = originFiles;
    }

    public void updateChatId(long chatId) {
        this.chatId = chatId;
    }
}