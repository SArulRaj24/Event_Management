package com.arul.Infosys.model.key;

import java.io.Serializable;
import java.util.Objects;

public class RegistrationKey implements Serializable {

    private Long eventId;
    private String volunteerId;

    public RegistrationKey() {}

    public RegistrationKey(Long eventId, String volunteerId) {
        this.eventId = eventId;
        this.volunteerId = volunteerId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RegistrationKey)) return false;
        RegistrationKey that = (RegistrationKey) o;
        return Objects.equals(eventId, that.eventId) &&
                Objects.equals(volunteerId, that.volunteerId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, volunteerId);
    }
}
