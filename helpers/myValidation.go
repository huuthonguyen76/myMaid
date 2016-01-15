package helpers

import ()

func ValidateRegister(username string, password string) bool {
	if username == "" || password == "" {
		return false
	}
	return true
}
