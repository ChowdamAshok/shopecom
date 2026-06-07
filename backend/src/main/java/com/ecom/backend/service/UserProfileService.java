package com.ecom.backend.service;

import com.ecom.backend.dto.request.AddressRequest;
import com.ecom.backend.dto.request.ChangePasswordRequest;
import com.ecom.backend.dto.request.UpdateProfileRequest;
import com.ecom.backend.dto.response.AddressResponse;
import com.ecom.backend.dto.response.UserResponse;

import java.util.List;

public interface UserProfileService {
    UserResponse getProfile(Long userId);
    UserResponse updateProfile(Long userId, UpdateProfileRequest request);
    void changePassword(Long userId, ChangePasswordRequest request);
    AddressResponse addAddress(Long userId, AddressRequest request);
    List<AddressResponse> getAddresses(Long userId);
    AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request);
    void deleteAddress(Long userId, Long addressId);
}