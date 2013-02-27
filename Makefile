UNITS = $(shell find test -name "*.test.js")
SPECS = $(shell find test -name "*.spec.js")

unit:
	NODE_ENV=test ./node_modules/.bin/mocha -t 5000 $(UNITS)

spec:
	NODE_ENV=test ./node_modules/.bin/mocha -t 5000 $(SPECS)

test:
	NODE_ENV=test ./node_modules/.bin/mocha -t 5000 $(UNITS) $(SPECS)

.PHONY: test unit spec