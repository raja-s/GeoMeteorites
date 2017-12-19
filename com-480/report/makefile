
.PHONY: all

all: main.pdf

main.pdf: main.tex
	pdflatex main.tex
	bibtex main.aux
	pdflatex main.tex
	pdflatex main.tex
	rm -f main.aux main.dvi main.log main.out main.bbl main.blg
