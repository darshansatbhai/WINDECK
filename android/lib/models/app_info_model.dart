class AppInfoModel {
  final String name;
  final String path;
  final bool isUWP;

  AppInfoModel({required this.name, required this.path, required this.isUWP});

  factory AppInfoModel.fromJson(Map<String, dynamic> json) {
    return AppInfoModel(
      name: json['name'] ?? 'Unknown App',
      path: json['path'] ?? '',
      isUWP: json['isUWP'] ?? false,
    );
  }
}
