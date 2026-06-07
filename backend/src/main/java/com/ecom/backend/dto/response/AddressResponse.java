package com.ecom.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {
    private Long id;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private boolean defaultAddress;
}