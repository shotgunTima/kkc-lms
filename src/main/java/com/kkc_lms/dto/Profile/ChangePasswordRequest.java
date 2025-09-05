package com.kkc_lms.dto.Profile;


public record ChangePasswordRequest(String oldPassword, String newPassword, String confirmPassword) {

}
