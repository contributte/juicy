.PHONY: install
install:
	npm install

.PHONY: compile
compile:
	npx nx run-many -t compile
