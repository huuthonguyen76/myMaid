package helpers

import (
	"regexp"
)

func IsAlphabet(word string) bool {
	r, _ := regexp.Compile(`[^a-zA-Z]`)
	return !r.MatchString(word)
}

func IsAlphabetLower(word string) bool {
	r, _ := regexp.Compile(`[^a-z]`)
	return !r.MatchString(word)
}

func IsAlphabetUpper(word string) bool {
	r, _ := regexp.Compile(`[^A-Z]`)
	return !r.MatchString(word)
}

func IsNumber(word string) bool {
	r, _ := regexp.Compile(`[^0-9]`)
	return !r.MatchString(word)
}
