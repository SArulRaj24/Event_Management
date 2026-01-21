package com.arul.Infosys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class InfosysApplication {

	public static void main(String[] args) {

        SpringApplication.run(InfosysApplication.class, args);
        System.out.println("Project Started");
	}

}
