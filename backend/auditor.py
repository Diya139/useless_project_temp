from rules import PLACEMENT_RULES


def get_zone(x, y, width=1000, height=700):

    if y < height * 0.30:

        if x < width * 0.33:
            return "upper_left"

        elif x < width * 0.66:
            return "upper_middle"

        else:
            return "upper_right"

    elif y > height * 0.70:

        return "bottom"

    else:

        if x < width * 0.33:
            return "left"

        elif x < width * 0.66:
            return "center"

        else:
            return "right"


def audit_item(name, x, y):

    actual_zone = get_zone(x, y)

    expected_zone = PLACEMENT_RULES.get(name)

    if expected_zone is None:

        return {
            "name": name,
            "actual_zone": actual_zone,
            "expected_zone": None,
            "status": "unknown",
            "message": "No official regulation exists for this item."
        }

    if actual_zone == expected_zone:

        return {
            "name": name,
            "actual_zone": actual_zone,
            "expected_zone": expected_zone,
            "status": "correct",
            "message": "Placement approved by the Sadhya Authority."
        }

    else:

        return {
            "name": name,
            "actual_zone": actual_zone,
            "expected_zone": expected_zone,
            "status": "violation",
            "message": f"{name} is not in its approved zone."
        }
if __name__ == "__main__":

    result = audit_item("pickle", 900, 100)

    print(result)