package com.arul.Infosys.dto;

import java.util.List;

public class EventParticipantsResponse {

    private int total;
    private List<String> volunteers;

    public EventParticipantsResponse(int total, List<String> volunteers) {
        this.total = total;
        this.volunteers = volunteers;
    }

    public int getTotal() {
        return total;
    }

    public List<String> getVolunteers() {
        return volunteers;
    }
}
