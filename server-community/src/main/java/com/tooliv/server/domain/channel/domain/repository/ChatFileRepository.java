package com.tooliv.server.domain.channel.domain.repository;

import com.tooliv.server.domain.channel.domain.ChatFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatFileRepository extends JpaRepository<ChatFile, String> {

}