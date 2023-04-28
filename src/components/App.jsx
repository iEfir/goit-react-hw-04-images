import React, { useState } from 'react';
import { Report } from 'notiflix/build/notiflix-report-aio';

import { fetchImage } from './apiService/Api';
import { Searchbar } from './searchbar/Searchbar';
import { ImageGallery } from './imageGallery/ImageGallery';
import { LoadMoreBtn } from './buttonLoadMore/Button';
import { Loader } from './reactLoader/Loader';
import { Modal } from './Modal/Modal';
import { Container } from './App.styled';
import { ErrorData } from './messageError/errorData/ErrorData';
import { errorMessage } from './messageError/errorMessage';

export function App() {
  const [images, setImages] = useState(null);
  const [pageNum, setPageNum] = useState(2);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const [btnVision, setBtnVision] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);

  const acceptSearch = async userSearch => {
    if (search === userSearch || userSearch === '') {
      return;
    }

    try {
      setImages(null);
      setIsLoading(true);
      setSearch(userSearch);
      setPageNum(2);
      setBtnVision(true);

      const response = await fetchImage(userSearch);
      setImages(response.hits);

      if (response.total === 0) {
        setError(errorMessage(search));
      }
    } catch {
      setError(ErrorData());
    } finally {
      setIsLoading(false);
    }
  };

  const onClickPageUp = async () => {
    try {
      setIsLoadingSpinner(true);

      setPageNum(pageNum + 1);
      const response = await fetchImage(search, pageNum);

      const nextPictures = response.hits;
      if (nextPictures.length < 1) {
        setBtnVision(false);
        Report.info(
          "That's all",
          "We're sorry, but you've reached the end of search results.",
          'Okay'
        );
        return;
      }
      setImages([...images, ...nextPictures]);
    } catch {
      setError(ErrorData());
    } finally {
      setIsLoading(false);
      setIsLoadingSpinner(false);
    }
  };

  const toggleModal = () => {
    setShowModal(showModal => !showModal);
  };

  const updateModalPicture = img => {
    setModalImg(img);
  };

  return (
    <>
      <Container>
        <Searchbar onSubmit={acceptSearch} />
        {isLoading && <Loader />}

        {error && error}

        {images && (
          <ImageGallery
            images={images}
            onClick={toggleModal}
            onUpdateModalPicture={updateModalPicture}
          />
        )}
        {images && images.length > 11 && btnVision && (
          <>
            <LoadMoreBtn
              onLoadMore={onClickPageUp}
              isLoadingSpin={isLoadingSpinner}
            />
          </>
        )}

        {showModal && <Modal onClose={toggleModal} onGiveImg={modalImg} />}
      </Container>
    </>
  );
}
