import unittest
from avatar import *

class TestActionsGestures(unittest.TestCase):

    def test_action_incompatibility(self):
        self.assertTrue(Actions.STAND.value.illegal_combination(Actions.SIT.value))
        self.assertTrue(Actions.STAND.value.illegal_combination(Actions.LAY.value))
        self.assertTrue(Actions.STAND.value.illegal_combination(Actions.WALK.value))
        self.assertTrue(Actions.SIT.value.illegal_combination(Actions.LAY.value))
        self.assertTrue(Actions.SIT.value.illegal_combination(Actions.WALK.value))
        self.assertTrue(Actions.SIT.value.illegal_combination(Actions.STAND.value))
        self.assertTrue(Actions.LAY.value.illegal_combination(Actions.STAND.value))
        self.assertTrue(Actions.LAY.value.illegal_combination(Actions.SIT.value))
        self.assertTrue(Actions.LAY.value.illegal_combination(Actions.WALK.value))
        self.assertTrue(Actions.LAY.value.illegal_combination(Actions.WAVE.value))
        self.assertTrue(Actions.WALK.value.illegal_combination(Actions.STAND.value))
        self.assertTrue(Actions.WALK.value.illegal_combination(Actions.SIT.value))
        self.assertTrue(Actions.WALK.value.illegal_combination(Actions.LAY.value))
        self.assertTrue(Actions.WAVE.value.illegal_combination(Actions.LAY.value))

    def test_action_from_string(self):
        # Test Valid
        self.assertEqual(Actions.STAND, Actions.from_key("std"))
        self.assertEqual(Actions.SIT, Actions.from_key("sit"))
        self.assertEqual(Actions.LAY, Actions.from_key("lay"))
        self.assertEqual(Actions.WALK, Actions.from_key("wlk"))
        self.assertEqual(Actions.WAVE, Actions.from_key("wav"))

        #Test Invalid
        self.assertIsNone(Actions.from_key(""))
        self.assertIsNone(Actions.from_key(None))
        self.assertIsNone(Actions.from_key("-1"))
        self.assertIsNone(Actions.from_key("idk"))

        # Test Foreach
        for action in Actions:
            if isinstance(action.value, Action): # Skip Anything but Action
                self.assertEqual(action, Actions.from_key(action.value.key))

    def test_gesture_from_string(self):

        # Test Valid
        self.assertEqual(Gestures.STANDARD, Gestures.from_key("std"))
        self.assertEqual(Gestures.SMILE, Gestures.from_key("sml"))
        self.assertEqual(Gestures.SAD, Gestures.from_key("sad"))
        self.assertEqual(Gestures.ANGRY, Gestures.from_key("agr"))
        self.assertEqual(Gestures.SURPRISED, Gestures.from_key("srp"))
        self.assertEqual(Gestures.EYEBLINK, Gestures.from_key("eyb"))
        self.assertEqual(Gestures.SPEAK, Gestures.from_key("spk"))

        # Test Invalid
        self.assertIsNone(Gestures.from_key(""))
        self.assertIsNone(Gestures.from_key(None))
        self.assertIsNone(Gestures.from_key("-1"))
        self.assertIsNone(Gestures.from_key("idk"))

        # Test Foreach
        for gesture in Gestures:
            self.assertEqual(gesture, Gestures.from_key(gesture.value))

    def test_size_from_string(self):
        # Test Valid
        self.assertEqual(Sizes.SMALL, Sizes.from_key("s"))
        self.assertEqual(Sizes.NORMAL, Sizes.from_key("m"))
        self.assertEqual(Sizes.LARGE, Sizes.from_key("l"))
        self.assertEqual(Sizes.XLARGE, Sizes.from_key("xl"))

        # Test Invalid
        self.assertEqual(Sizes.from_key(""), Sizes.NORMAL)
        self.assertEqual(Sizes.from_key(None), Sizes.NORMAL)
        self.assertEqual(Sizes.from_key("-1"), Sizes.NORMAL)
        self.assertEqual(Sizes.from_key("idk"), Sizes.NORMAL)

        # Test Foreach
        for size in Sizes:
            self.assertEqual(size, Sizes.from_key(size.value.key))

    def test_set_types_from_string(self):

        for set_type in PartTypes:
            if isinstance(set_type.value, PartType):
                self.assertEqual(set_type.value, PartTypes.from_key(set_type.value.key))

if __name__ == '__main__':
    unittest.main()