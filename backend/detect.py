from ultralytics import YOLO
from backend.auditor import get_zone


model = YOLO("yolo11n.pt")

results = model("sadya.jpg")


for result in results:

    width = result.orig_shape[1]
    height = result.orig_shape[0]

    print(f"\nImage size: {width} x {height}")

    for box in result.boxes:

        class_id = int(box.cls[0])
        confidence = float(box.conf[0])

        name = result.names[class_id]

        x1, y1, x2, y2 = box.xyxy[0].tolist()

        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2

        zone = get_zone(
            center_x,
            center_y,
            width,
            height
        )

        print(f"\n{name}")
        print(f"Confidence: {confidence:.2f}")
        print(f"Center: ({center_x:.0f}, {center_y:.0f})")
        print(f"Zone: {zone}")