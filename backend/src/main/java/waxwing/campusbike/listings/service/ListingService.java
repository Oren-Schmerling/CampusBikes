package waxwing.campusbike.listings.service;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;

public class ListingService {

  @Autowired
  private DataSource dataSource;

}
