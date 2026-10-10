class TileModel {
  final String id;
  final String type; // 'app', 'system', 'custom', 'empty'
  final String label;
  final String icon;
  final String? action;
  final Map<String, dynamic> payload;

  TileModel({
    required this.id,
    required this.type,
    required this.label,
    required this.icon,
    this.action,
    required this.payload,
  });

  factory TileModel.empty(String id) => TileModel(
    id: id, type: 'empty', label: '', icon: '', action: null, payload: {}
  );

  factory TileModel.fromJson(Map<String, dynamic> json) => TileModel(
    id: json['id'],
    type: json['type'],
    label: json['label'] ?? '',
    icon: json['icon'] ?? '',
    action: json['action'],
    payload: Map<String, dynamic>.from(json['payload'] ?? {}),
  );

  Map<String, dynamic> toJson() => {
    'id': id, 'type': type, 'label': label,
    'icon': icon, 'action': action, 'payload': payload,
  };

  TileModel copyWith({String? label, String? icon, String? action, Map<String, dynamic>? payload}) =>
    TileModel(id: id, type: type, label: label ?? this.label,
      icon: icon ?? this.icon, action: action ?? this.action, payload: payload ?? this.payload);
}
