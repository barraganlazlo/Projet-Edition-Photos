all : test_grey seuil profilDat histogramme histogramme_couleur seuil_ppm expansion_dynamique expansion_d3 extrema_histo egalisation convert_gray blur blur_pointed ROC erosion

test_grey:
	g++ -Wall -I ../librairie -o bin/test_grey src/test_grey.cpp
seuil:
	g++ -Wall -I ../librairie -o bin/seuil src/seuil.cpp
profilDat :
	g++ -Wall -I ../librairie -o bin/profilDat src/profilDat.cpp
histogramme :
	g++ -Wall -I ../librairie -o bin/histogramme src/histogramme.cpp
histogramme_couleur :
	g++ -Wall -I ../librairie -o bin/histogramme_couleur src/histogramme_couleur.cpp
seuil_ppm :
	g++ -Wall -I ../librairie -o bin/seuil_ppm src/seuil_ppm.cpp
expansion_dynamique :
	g++ -Wall -I ../librairie -o bin/expansion_dynamique src/expansion_dynamique.cpp
expansion_d3 :
	g++ -Wall -I ../librairie -o bin/expansion_d3 src/expansion_d3.cpp
extrema_histo :
	g++ -Wall -I ../librairie -o bin/extrema_histo src/extrema_histo.cpp
egalisation :
	g++ -Wall -I ../librairie -o bin/egalisation src/egalisation.cpp
convert_gray :
	g++ -Wall -I ../librairie -o bin/convert_gray src/convert_gray.cpp
blur :
	g++ -Wall -I ../librairie -o bin/blur src/blur.cpp
blur_pointed :
	g++ -Wall -I ../librairie -o bin/blur_pointed src/blur_pointed.cpp
ROC :
	g++ -Wall -I ../librairie -o bin/ROC src/ROC.cpp
erosion :
	g++ -Wall -I ../librairie -o bin/erosion src/erosion.cpp

clean :
	rm -rf obj/*.o
mrproper :
	rm -rf bin/*
