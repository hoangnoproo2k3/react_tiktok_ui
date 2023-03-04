import { useEffect, useRef, useState } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import { SearchIcon } from '~/components/Icons';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';
import * as searchServices from '~/services/searchServices';
const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearcValue] = useState('');
    const [searchResult, setsearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);
    const debounced = useDebounce(searchValue, 500);
    const inputRef = useRef();
    useEffect(() => {
        if (!debounced.trim()) {
            setsearchResult([]);
            return;
        }
        const fetchApi = async () => {
            setLoading(true);
            const result = await searchServices.search(debounced);
            setsearchResult(result);
            setLoading(false);
        };
        fetchApi();
    }, [debounced]);

    //     request
    //         .get('users/search', {
    //             params: {
    //                 q: debounced,
    //                 type: 'less',
    //             },
    //         })
    //         .then((res) => {
    //             // console.log(res);
    //             setsearchResult(res.data);
    //             setLoading(false);
    //         })
    //         .catch(() => {
    //             setLoading(false);
    //         });
    // }, [debounced]);
    const handleClear = () => {
        setSearcValue('');
        setsearchResult([]);
        inputRef.current.focus();
    };
    const handleHideResult = () => {
        setShowResult(false);
    };
    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearcValue(e.target.value);
        }
    };

    return (
        //Using a wrapper <div> or <span> tag around the reference element solves this by creating a new parentNode context.
        <div>
            <HeadlessTippy
                // appendTo={() => document.body}
                interactive="true"
                visible={showResult && searchResult.length > 0}
                onClickOutside={handleHideResult}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Accounts</h4>
                            {searchResult.map((item) => (
                                <AccountItem key={item.id} data={item}></AccountItem>
                            ))}
                        </PopperWrapper>
                    </div>
                )}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Tìm kiếm tài khoản và video"
                        spellCheck="false"
                        onChange={handleChange}
                        onFocus={() => {
                            setShowResult(true);
                        }}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
                        </button>
                    )}

                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner}></FontAwesomeIcon>}

                    <button
                        className={cx('search-btn')}
                        onMouseDown={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
