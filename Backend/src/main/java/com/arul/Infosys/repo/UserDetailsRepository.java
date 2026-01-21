package com.arul.Infosys.repo;


import com.arul.Infosys.model.UserDetails;
import com.arul.Infosys.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails,String> {

}
