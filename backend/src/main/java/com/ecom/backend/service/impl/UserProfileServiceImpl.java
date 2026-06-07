package com.ecom.backend.service.impl;

import com.ecom.backend.dto.request.AddressRequest;
import com.ecom.backend.dto.request.ChangePasswordRequest;
import com.ecom.backend.dto.request.UpdateProfileRequest;
import com.ecom.backend.dto.response.AddressResponse;
import com.ecom.backend.dto.response.UserResponse;
import com.ecom.backend.entity.Address;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.AddressRepository;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    @Override
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(request.getName());
        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.isDefaultAddress()) {
            addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                    .ifPresent(addr -> {
                        addr.setDefaultAddress(false);
                        addressRepository.save(addr);
                    });
        }

        Address address = Address.builder()
                .user(user)
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .defaultAddress(request.isDefaultAddress())
                .build();

        return mapToAddressResponse(addressRepository.save(address));
    }

    @Override
    public List<AddressResponse> getAddresses(Long userId) {
        return addressRepository.findAllByUserId(userId)
                .stream()
                .map(this::mapToAddressResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to update this address");
        }

        if (request.isDefaultAddress()) {
            addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                    .ifPresent(addr -> {
                        addr.setDefaultAddress(false);
                        addressRepository.save(addr);
                    });
        }

        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setDefaultAddress(request.isDefaultAddress());

        return mapToAddressResponse(addressRepository.save(address));
    }

    @Override
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to delete this address");
        }

        addressRepository.delete(address);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private AddressResponse mapToAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .defaultAddress(address.isDefaultAddress())
                .build();
    }
}