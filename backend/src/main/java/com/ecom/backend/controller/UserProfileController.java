package com.ecom.backend.controller;

import com.ecom.backend.dto.request.AddressRequest;
import com.ecom.backend.dto.request.ChangePasswordRequest;
import com.ecom.backend.dto.request.UpdateProfileRequest;
import com.ecom.backend.dto.response.AddressResponse;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.UserResponse;
import com.ecom.backend.entity.User;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched",
                userProfileService.getProfile(user.getId())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                userProfileService.updateProfile(user.getId(), request)));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        User user = getUser(userDetails);
        userProfileService.changePassword(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Addresses fetched",
                userProfileService.getAddresses(user.getId())));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddressRequest request) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Address added",
                userProfileService.addAddress(user.getId(), request)));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Address updated",
                userProfileService.updateAddress(user.getId(), addressId, request)));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long addressId) {
        User user = getUser(userDetails);
        userProfileService.deleteAddress(user.getId(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Address deleted"));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}