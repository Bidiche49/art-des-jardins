/// Form validators returning null on success, error message on failure.
class Validators {
  const Validators._();

  static final RegExp _emailRegex = RegExp(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  );

  static final RegExp _phoneFRRegex = RegExp(
    r'^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$',
  );

  static final RegExp _postalCodeRegex = RegExp(r'^\d{5}$');

  static final RegExp _uuidRegex = RegExp(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    caseSensitive: false,
  );

  /// Validates that the field is not empty.
  static String? required(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Ce champ est requis';
    }
    return null;
  }

  /// Validates an email address.
  static String? email(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Ce champ est requis';
    }
    if (!_emailRegex.hasMatch(value.trim())) {
      return 'Email invalide';
    }
    return null;
  }

  /// Validates a French phone number.
  static String? phoneFR(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Ce champ est requis';
    }
    final cleaned = value.replaceAll(RegExp(r'[\s.-]'), '');
    // Check with cleaned number (no spaces/dashes) for length validation
    if (!_phoneFRRegex.hasMatch(value.trim()) && !_phoneFRRegex.hasMatch(cleaned)) {
      return 'Numéro de téléphone invalide';
    }
    return null;
  }

  /// Validates a French postal code (5 digits).
  static String? postalCode(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Ce champ est requis';
    }
    if (!_postalCodeRegex.hasMatch(value.trim())) {
      return 'Code postal invalide (5 chiffres)';
    }
    return null;
  }

  /// Validates a UUID v4 format.
  static String? uuid(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Ce champ est requis';
    }
    if (!_uuidRegex.hasMatch(value.trim())) {
      return 'UUID invalide';
    }
    return null;
  }
}
