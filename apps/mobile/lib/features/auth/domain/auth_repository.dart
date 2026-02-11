import '../../../domain/models/auth_response.dart';
import '../../../domain/models/user.dart';

abstract class AuthRepository {
  Future<AuthResponse> login({
    required String email,
    required String password,
  });

  Future<AuthResponse> refresh();

  Future<void> logout();

  Future<User?> getCurrentUser();

  Future<bool> isAuthenticated();

  Future<String?> getAccessToken();
}
