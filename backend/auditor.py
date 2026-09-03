# ============================================================
#                    SADYA AUDITOR
# ============================================================


EXPECTED_ZONES = {

    "pickle": [
        "upper_left",
        "left"
    ],

    "pachadi": [
        "upper_right",
        "right"
    ],

    "kichadi": [
        "upper_right",
        "right"
    ],

    "thoran": [
        "upper_left",
        "left"
    ],

    "avial": [
        "upper_middle",
        "upper_left"
    ],

    "olan": [
        "upper_middle",
        "upper_right"
    ],

    "kalan": [
        "upper_right",
        "right"
    ],

    "sambar": [
        "center",
        "bottom"
    ],

    "parippu": [
        "center",
        "upper_middle"
    ],

    "payasam": [
        "bottom",
        "bottom_right"
    ],

    "papad": [
        "bottom",
        "upper_right"
    ],

    "banana": [
        "bottom",
        "bottom_left"
    ],

    "rice": [
        "center",
        "bottom"
    ],

    "banana_leaf": [
        "center"
    ]
}


# ============================================================
#                    ZONE DETECTION
# ============================================================


def get_zone(x, y, width, height):

    x_percent = x / width
    y_percent = y / height


    # Vertical position

    if y_percent < 0.25:

        vertical = "upper"

    elif y_percent > 0.70:

        vertical = "bottom"

    else:

        vertical = "center"


    # Horizontal position

    if x_percent < 0.30:

        horizontal = "left"

    elif x_percent > 0.70:

        horizontal = "right"

    else:

        horizontal = "middle"


    # Center

    if (
        vertical == "center"
        and horizontal == "middle"
    ):

        return "center"


    # Upper middle

    if (
        vertical == "upper"
        and horizontal == "middle"
    ):

        return "upper_middle"


    return f"{vertical}_{horizontal}"


# ============================================================
#                    INDIVIDUAL AUDIT
# ============================================================


def audit_item(
    name,
    x,
    y,
    width,
    height
):

    name = name.lower()

    zone = get_zone(
        x,
        y,
        width,
        height
    )


    # Unknown dish

    if name not in EXPECTED_ZONES:

        return {

            "status": "unknown",

            "message": (
                f"{name} has entered the Sadya "
                f"without submitting the required paperwork."
            )
        }


    # Correct-ish position

    if zone in EXPECTED_ZONES[name]:

        return {

            "status": "acceptable",

            "message": (
                f"{name} is behaving suspiciously well."
            )
        }


    # Wrong position

    return {

        "status": "violation",

        "message": (
            f"{name} has violated its "
            f"approved banana-leaf jurisdiction."
        )
    }


# ============================================================
#                    FINAL ROAST
# ============================================================


def generate_roast(detected_items):

    score = 100

    violations = []


    detected_names = [

        item["name"].lower()

        for item in detected_items

    ]


    # --------------------------------------------------------
    # Check individual dish positions
    # --------------------------------------------------------

    for item in detected_items:

        name = item["name"].lower()

        zone = item["zone"]


        if name in EXPECTED_ZONES:

            if zone not in EXPECTED_ZONES[name]:

                score -= 18


                violations.append(

                    f"🚨 {name.upper()} has "
                    f"crossed its territorial boundary."
                )


        else:

            score -= 8


            violations.append(

                f"❓ {name.upper()} has appeared "
                f"without authorization."
            )


    # --------------------------------------------------------
    # Too few dishes
    # --------------------------------------------------------

    if len(detected_items) <= 2:

        score -= 35


        violations.append(

            "🚨 CRITICAL: Only a suspiciously "
            "small number of dishes were detected."
        )


        violations.append(

            "Was this a Sadya or did everyone "
            "eat before the auditor arrived?"
        )


    elif len(detected_items) <= 4:

        score -= 20


        violations.append(

            "⚠️ Several important dishes appear "
            "to have mysteriously vanished."
        )


    elif len(detected_items) <= 7:

        score -= 10


        violations.append(

            "⚠️ The Sadya appears to be "
            "operating on a reduced budget."
        )


    # --------------------------------------------------------
    # Important dishes
    # --------------------------------------------------------

    important_dishes = [

        "avial",
        "thoran",
        "pachadi",
        "sambar",
        "parippu",
        "payasam"

    ]


    missing_count = 0


    for dish in important_dishes:

        if dish not in detected_names:

            missing_count += 1


    if missing_count >= 4:

        score -= 25


        violations.append(

            "🚨 Multiple culturally significant "
            "dishes are currently unaccounted for."
        )


    elif missing_count >= 2:

        score -= 12


        violations.append(

            "⚠️ The dish attendance sheet "
            "is looking concerning."
        )


    # --------------------------------------------------------
    # Duplicate dishes
    # --------------------------------------------------------

    for name in set(detected_names):

        count = detected_names.count(name)


        if count >= 3:

            score -= 8


            violations.append(

                f"⚠️ {count} separate "
                f"{name.upper()} detections. "
                f"Someone has lost containment."
            )


    # --------------------------------------------------------
    # General chaos penalty
    # --------------------------------------------------------

    if len(detected_items) >= 8:

        score -= 5


        violations.append(

            "⚠️ An unreasonable number of "
            "items have entered the investigation."
        )


    # --------------------------------------------------------
    # Keep score between 0 and 100
    # --------------------------------------------------------

    score = max(
        0,
        min(100, score)
    )


    # --------------------------------------------------------
    # Verdict
    # --------------------------------------------------------

    if score >= 80:

        verdict = (

            "Suspiciously competent. "
            "We may have to approve this Sadya."
        )


    elif score >= 65:

        verdict = (

            "Technically acceptable. "
            "But we are keeping an eye on it."
        )


    elif score >= 50:

        verdict = (

            "Technically a Sadya. "
            "Spiritually questionable."
        )


    elif score >= 35:

        verdict = (

            "This banana leaf requires "
            "immediate administrative intervention."
        )


    elif score >= 15:

        verdict = (

            "The banana leaf has officially "
            "lost the plot."
        )


    else:

        verdict = (

            "This is not a Sadya. "
            "This is a cry for help."
        )


    # --------------------------------------------------------
    # Extra roast for bad Sadya
    # --------------------------------------------------------

    if score < 70:

        extra_roasts = [

            "The banana leaf deserves better.",

            "Kerala's ancestors are deeply concerned.",

            "Several dishes appear to have "
            "forgotten why they came here.",

            "Spatial organization: catastrophic.",

            "This arrangement violates at least "
            "three imaginary laws.",

            "The leaf is innocent. "
            "The arrangement is not.",

            "We have reviewed the evidence. "
            "Unfortunately, there is evidence.",

            "The Sadya committee has requested "
            "that we stop calling this a Sadya.",

            "Presentation score: academically concerning.",

            "Who approved this banana leaf?",

            "This is less 'traditional Sadya' "
            "and more 'food placed nearby.'"

        ]


        violations.append(

            extra_roasts[
                score % len(extra_roasts)
            ]

        )


    # --------------------------------------------------------
    # Return final report
    # --------------------------------------------------------

    return {

        "score": score,

        "violations": violations,

        "verdict": verdict

    }